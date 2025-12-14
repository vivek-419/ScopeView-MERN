const mongoose = require('mongoose');

const connectDB = async () => {
  // Default to local MongoDB if MONGODB_URI is not set
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scopeview';
  
  try {
    // Disable buffering and auto index in production
    mongoose.set('bufferCommands', false);
    mongoose.set('autoIndex', process.env.NODE_ENV !== 'production');
    
    console.log('Connecting to MongoDB...');
    
    // Use simple connection options for Mongoose 6+
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('Make sure MongoDB is running and the connection string is correct.');
    console.log('If using local MongoDB, you can start it with: mongod --dbpath=/data/db');
    return null;
  }
};

const disconnectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB disconnected');
    }
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message);
  }
};

// Event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Export both functions
module.exports = {
  connectDB,
  disconnectDB
};