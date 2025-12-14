const { v4: uuidv4 } = require('uuid');
const TelemetryPoint = require('../models/TelemetryPoint');

class WebSocketService {
  constructor(io) {
    this.io = io;
    this.sessions = new Map(); // Map<sessionId, Set<clientId>>
    this.clients = new Map();  // Map<clientId, { socket, sessionId }>
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      // Handle new client connection
      socket.on('subscribe', (data, callback) => {
        const { sessionId, streamKeys = [] } = data;
        this.handleSubscribe(socket, sessionId, streamKeys, callback);
      });
      
      // Handle client disconnection
      socket.on('disconnect', () => {
        this.handleDisconnect(socket.id);
      });
      
      // Handle telemetry data from clients (if needed)
      socket.on('telemetry:data', (data) => {
        this.handleIncomingTelemetry(socket.id, data);
      });
      
      // Handle ping/pong for connection health
      socket.on('ping', (cb) => {
        if (typeof cb === 'function') {
          cb();
        }
      });
    });
  }
  
  handleSubscribe(socket, sessionId, streamKeys, callback) {
    if (!sessionId) {
      if (callback) {
        callback({ success: false, error: 'sessionId is required' });
      }
      return;
    }
    
    const clientId = socket.id;
    const clientInfo = { socket, sessionId, streamKeys };
    
    // Add client to the session
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, new Set());
    }
    this.sessions.get(sessionId).add(clientId);
    
    // Store client info
    this.clients.set(clientId, clientInfo);
    
    console.log(`Client ${clientId} subscribed to session ${sessionId}`);
    
    if (callback) {
      callback({ 
        success: true, 
        clientId,
        sessionId,
        streamKeys
      });
    }
    
    // Send initial data if needed
    this.sendInitialData(socket, sessionId, streamKeys);
  }
  
  async sendInitialData(socket, sessionId, streamKeys) {
    try {
      if (!streamKeys || streamKeys.length === 0) {
        return;
      }
      
      // Get the latest data points for each stream
      const pipeline = [
        {
          $match: {
            sessionId,
            streamKey: { $in: streamKeys }
          }
        },
        {
          $sort: { timestamp: -1 }
        },
        {
          $group: {
            _id: "$streamKey",
            data: { $first: "$$ROOT" }
          }
        },
        {
          $replaceRoot: { newRoot: "$data" }
        }
      ];
      
      const latestPoints = await TelemetryPoint.aggregate(pipeline);
      
      if (latestPoints.length > 0) {
        socket.emit('telemetry:initial', latestPoints);
      }
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }
  
  async handleIncomingTelemetry(clientId, data) {
    try {
      const client = this.clients.get(clientId);
      if (!client) {
        console.warn(`Received data from unknown client: ${clientId}`);
        return;
      }
      
      const { sessionId } = client;
      const telemetryPoints = Array.isArray(data) ? data : [data];
      
      // Add timestamp if not provided
      const now = new Date();
      const pointsToSave = telemetryPoints.map(point => ({
        ...point,
        sessionId,
        timestamp: point.timestamp || now,
        _id: point._id || uuidv4()
      }));
      
      // Save to database (in a real app, you might want to batch these)
      await TelemetryPoint.insertMany(pointsToSave, { ordered: false });
      
      // Broadcast to all clients in the same session
      this.broadcastToSession(sessionId, 'telemetry:update', pointsToSave);
      
    } catch (error) {
      console.error('Error handling incoming telemetry:', error);
    }
  }
  
  broadcastToSession(sessionId, event, data) {
    const clients = this.sessions.get(sessionId);
    if (!clients) return;
    
    clients.forEach(clientId => {
      const client = this.clients.get(clientId);
      if (client && client.socket) {
        client.socket.emit(event, data);
      }
    });
  }
  
  handleDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    const { sessionId } = client;
    
    // Remove client from the session
    if (this.sessions.has(sessionId)) {
      const sessionClients = this.sessions.get(sessionId);
      sessionClients.delete(clientId);
      
      // Clean up empty sessions
      if (sessionClients.size === 0) {
        this.sessions.delete(sessionId);
      }
    }
    
    // Remove client from clients map
    this.clients.delete(clientId);
    
    console.log(`Client disconnected: ${clientId}`);
  }
  
  // Method to send data to specific clients
  sendToClient(clientId, event, data) {
    const client = this.clients.get(clientId);
    if (client && client.socket) {
      client.socket.emit(event, data);
    }
  }
  
  // Method to broadcast to all connected clients
  broadcast(event, data) {
    this.io.emit(event, data);
  }
}

module.exports = WebSocketService;
