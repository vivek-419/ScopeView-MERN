const express = require('express');
const configController = require('../controllers/configController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// GET /api/config/streams - Get all stream configurations
router.get('/streams', configController.getAllConfigs);

// GET /api/config/streams/:id - Get single stream configuration
router.get('/streams/:id', configController.getConfigById);

// POST /api/config/streams - Create new stream configuration (engineer/admin only)
router.post('/streams', authorizeRole('engineer', 'admin'), configController.createConfig);

// PUT /api/config/streams/:id - Update stream configuration (engineer/admin only)
router.put('/streams/:id', authorizeRole('engineer', 'admin'), configController.updateConfig);

// DELETE /api/config/streams/:id - Delete stream configuration (engineer/admin only)
router.delete('/streams/:id', authorizeRole('engineer', 'admin'), configController.deleteConfig);

module.exports = router;
