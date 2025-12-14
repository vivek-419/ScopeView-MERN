const express = require('express');
const telemetryController = require('../controllers/telemetryController');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all telemetry routes
router.use(verifyToken);

// GET /api/telemetry - Get historical telemetry data
// Query params: streamKey, sessionId, limit, startTime, endTime, aggregate, streams
router.get('/telemetry', telemetryController.getTelemetry);

// GET /api/sessions/:sessionId/streams - Get available streams for a session
router.get('/sessions/:sessionId/streams', telemetryController.getAvailableStreams);

// GET /api/telemetry/stats - Get telemetry statistics
// Query params: streamKey, sessionId, startTime, endTime
router.get('/telemetry/stats', telemetryController.getTelemetryStats);

module.exports = router;
