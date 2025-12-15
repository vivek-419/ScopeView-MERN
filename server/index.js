const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { connectDB } = require('./utils/db');
const TelemetryPoint = require('./models/TelemetryPoint');
const StreamConfig = require('./models/StreamConfig');
const WebSocketService = require('./services/websocket');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_URL].filter(Boolean),
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
const authRoutes = require('./routes/auth');
const streamRoutes = require('./routes/streams');
const telemetryRoutes = require('./routes/telemetry');
const configRoutes = require('./routes/config');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api', streamRoutes);
app.use('/api', telemetryRoutes);
app.use('/api/config', configRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO to server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 10000,    // 10 seconds
  pingInterval: 5000,    // 5 seconds
  maxHttpBufferSize: 1e8 // 100MB max message size
});

// Initialize WebSocket service
const webSocketService = new WebSocketService(io);

// Telemetry buffer for batch processing
const telemetryBuffer = [];
const BATCH_SIZE = process.env.BATCH_SIZE || 100; // Number of points to batch before saving
const BATCH_TIMEOUT = process.env.BATCH_TIMEOUT || 1000; // Max time to wait before saving a partial batch (ms)

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: "UP", 
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ScopeView Server is running!',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Test endpoint
  socket.on('test', (data) => {
    console.log('📤 Received test message from', socket.id, ':', data);
    socket.emit('test-response', { 
      status: 'success', 
      message: 'Test message received',
      yourData: data,
      timestamp: new Date().toISOString()
    });
  });

  // Subscribe to streams
  socket.on('subscribe', ({ sessionId, streamKeys, streams }) => {
    const streamList = streamKeys || streams || [];
    
    if (sessionId) {
      socket.join(`session:${sessionId}`);
      console.log(`Client ${socket.id} subscribed to session ${sessionId}`);
    }
    
    if (Array.isArray(streamList) && streamList.length > 0) {
      streamList.forEach((streamKey) => {
        socket.join(streamKey);
        console.log(`Client ${socket.id} subscribed to ${streamKey}`);
      });
      socket.emit('subscription-confirmed', { 
        streams: streamList,
        sessionId,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle telemetry data from clients (if they're sending data)
  socket.on('telemetry', (data) => {
    if (!data || !data.streamKey || data.value === undefined || !data.timestamp || !data.sessionId) {
      console.log('⚠️  Invalid telemetry data from', socket.id);
      return;
    }

    // Broadcast to all clients in the stream's room and session's room
    io.to(data.streamKey).emit('telemetry', data);
    io.to(`session:${data.sessionId}`).emit('telemetry', data);

    // Push into buffer for batch DB saving
    telemetryBuffer.push({
      streamKey: data.streamKey,
      value: data.value,
      timestamp: new Date(data.timestamp),
      sessionId: data.sessionId
    });

    // If buffer too large, trim oldest entries
    if (telemetryBuffer.length > 5000) {
      telemetryBuffer.splice(0, telemetryBuffer.length - 5000);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Periodically flush telemetry buffer to MongoDB
setInterval(async () => {
  if (telemetryBuffer.length === 0) return;

  const batch = [...telemetryBuffer];
  telemetryBuffer.length = 0; // Clear buffer

  try {
    await TelemetryPoint.insertMany(batch);
    console.log(`Saved ${batch.length} telemetry points.`);
  } catch (error) {
    console.error('Error saving telemetry batch:', error.message);
  }
}, 3000); // Flush every 3 seconds

// Start server and connect to database
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    console.log('Connecting to MongoDB...');
    const dbConnection = await connectDB();
    
    // Start server
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
      console.log(`💾 Database status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not connected'}`);
      
      // Start data simulation ONLY after server is listening AND database is connected
      if (process.env.NODE_ENV !== 'production' && mongoose.connection.readyState === 1) {
        console.log('🎬 Starting telemetry data simulation...');
        startDataSimulation();
      } else if (process.env.NODE_ENV !== 'production') {
        console.log('⚠️  Database not connected. Skipping data simulation.');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    // Only exit if it's not a database connection error
    if (!error.message.includes('MongoDB')) {
      process.exit(1);
    }
  }
};

startServer();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  
  // Close the HTTP server
  server.close(() => {
    console.log('HTTP server closed.');
    
    // Close the database connection
    mongoose.connection.close(false, () => {
      console.log('Database connection closed.');
      process.exit(0);
    });
  });
});

// Data simulation function for development
async function startDataSimulation() {
  const sessionId = 'demo-session-' + Date.now();
  let streams = [];
  const values = {};

  // Function to refresh active streams from DB
  const refreshStreams = async () => {
    try {
      const dbStreams = await StreamConfig.find({ isVisible: true });
      streams = dbStreams.map(s => ({
        key: s.streamKey,
        name: s.name,
        min: s.minValue,
        max: s.maxValue,
        // Calculate dynamic properties based on range if not available
        step: (s.maxValue - s.minValue) * 0.05, // 5% of range
        volatility: (s.maxValue - s.minValue) * 0.1 // 10% of range
      }));
      
      // Initialize values for new streams
      streams.forEach(stream => {
        if (values[stream.key] === undefined) {
          values[stream.key] = stream.min + Math.random() * (stream.max - stream.min) * 0.5;
        }
      });
    } catch (error) {
      console.error('Error refreshing streams for simulation:', error.message);
    }
  };

  // Initial refresh
  await refreshStreams();

  // Periodically refresh streams (every 5 seconds) to pick up new ones
  setInterval(refreshStreams, 5000);
  
  // Generate data points at regular intervals
  setInterval(() => {
    if (streams.length === 0) return;

    const timestamp = new Date();
    
    streams.forEach(stream => {
      // Update value with some randomness and trend
      const trend = (Math.random() * 2 - 1) * stream.step;
      values[stream.key] += trend;
      
      // Keep within bounds
      values[stream.key] = Math.max(stream.min, Math.min(stream.max, values[stream.key]));
      
      // Add significant noise for visual variation
      const noise = (Math.random() * 2 - 1) * stream.volatility;
      
      // Occasionally add spikes (10% chance)
      const spike = Math.random() < 0.1 ? (Math.random() * 2 - 1) * stream.volatility * 2 : 0;
      
      let value = values[stream.key] + noise + spike;
      
      // Clamp final value to bounds
      value = Math.max(stream.min, Math.min(stream.max, value));
      value = Math.round(value * 10) / 10;
      
      const point = {
        streamKey: stream.key,
        value,
        timestamp,
        sessionId
      };
      
      // Add to buffer
      telemetryBuffer.push(point);
      
      // Broadcast to clients subscribed to this stream
      io.to(stream.key).emit('telemetry:update', point);
    });
    
    // Process buffer in batches
    if (telemetryBuffer.length >= BATCH_SIZE) {
      const batch = telemetryBuffer.splice(0, BATCH_SIZE);
      TelemetryPoint.insertMany(batch, { ordered: false })
        .catch(err => console.error('Error saving telemetry batch:', err));
    }
  }, 100); // Emit 10 times per second (10 Hz) as per requirements
  
  // Process any remaining points in the buffer periodically
  setInterval(() => {
    if (telemetryBuffer.length > 0) {
      const batch = telemetryBuffer.splice(0, BATCH_SIZE);
      TelemetryPoint.insertMany(batch, { ordered: false })
        .catch(err => console.error('Error saving telemetry batch:', err));
    }
  }, BATCH_TIMEOUT);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Don't exit for database connection errors
  if (!err.message.includes('MongoDB')) {
    process.exit(1);
  }
});

module.exports = { app, io };