# ScopeView Backend

A Node.js + Express + Socket.IO backend for real-time telemetry data visualization.

## Features

- Express.js REST API
- Socket.IO for real-time communication
- MongoDB integration with Mongoose
- CORS configuration
- Health check endpoint
- Graceful shutdown handling
- Environment-based configuration

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and other settings.

4. Start the server:
```bash
npm start
```

## API Endpoints

- `GET /` - Basic server status
- `GET /health` - Health check with status and timestamp

## Socket.IO Events

- `telemetry-data` - Receive telemetry data from clients
- `telemetry-broadcast` - Broadcast telemetry data to all connected clients

## Environment Variables

See `.env.example` for all available environment variables.

## Development

The server runs on port 4000 by default. Make sure your MongoDB Atlas cluster is accessible and the connection string is properly configured in your environment variables.
