const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../utils/jwtMiddleware');
const streamController = require('../controllers/streamController');

// Protected routes (require JWT authentication)
router.get('/streams', jwtMiddleware, streamController.getStreams);
router.post('/streams', jwtMiddleware, streamController.createStream);
router.put('/streams/:id', jwtMiddleware, streamController.updateStream);
router.delete('/streams/:id', jwtMiddleware, streamController.deleteStream);

module.exports = router;
