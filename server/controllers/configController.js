const StreamConfig = require('../models/StreamConfig');

const configController = {
  // Get all stream configurations
  getAllConfigs: async (req, res) => {
    try {
      const configs = await StreamConfig.find().sort({ createdAt: -1 });
      res.json(configs);
    } catch (error) {
      console.error('Error fetching stream configs:', error);
      res.status(500).json({ message: 'Error fetching stream configurations' });
    }
  },

  // Get a single stream configuration by ID
  getConfigById: async (req, res) => {
    try {
      const config = await StreamConfig.findById(req.params.id);
      
      if (!config) {
        return res.status(404).json({ message: 'Stream configuration not found' });
      }
      
      res.json(config);
    } catch (error) {
      console.error('Error fetching stream config:', error);
      res.status(500).json({ message: 'Error fetching stream configuration' });
    }
  },

  // Create a new stream configuration
  createConfig: async (req, res) => {
    try {
      const { name, streamKey, minValue, maxValue, color, isVisible } = req.body;

      // Validate required fields
      if (!name || !streamKey) {
        return res.status(400).json({ message: 'Name and streamKey are required' });
      }

      // Check if streamKey already exists
      const existing = await StreamConfig.findOne({ streamKey });
      if (existing) {
        return res.status(409).json({ message: 'Stream with this key already exists' });
      }

      const config = await StreamConfig.create({
        name,
        streamKey,
        minValue: minValue || 0,
        maxValue: maxValue || 100,
        color: color || '#00aaff',
        isVisible: isVisible !== undefined ? isVisible : true
      });

      res.status(201).json(config);
    } catch (error) {
      console.error('Error creating stream config:', error);
      res.status(500).json({ message: 'Error creating stream configuration' });
    }
  },

  // Update a stream configuration
  updateConfig: async (req, res) => {
    try {
      const { name, streamKey, minValue, maxValue, color, isVisible } = req.body;

      const config = await StreamConfig.findById(req.params.id);
      
      if (!config) {
        return res.status(404).json({ message: 'Stream configuration not found' });
      }

      // If streamKey is being changed, check it doesn't conflict
      if (streamKey && streamKey !== config.streamKey) {
        const existing = await StreamConfig.findOne({ streamKey });
        if (existing) {
          return res.status(409).json({ message: 'Stream with this key already exists' });
        }
      }

      // Update fields
      if (name) config.name = name;
      if (streamKey) config.streamKey = streamKey;
      if (minValue !== undefined) config.minValue = minValue;
      if (maxValue !== undefined) config.maxValue = maxValue;
      if (color) config.color = color;
      if (isVisible !== undefined) config.isVisible = isVisible;

      await config.save();
      res.json(config);
    } catch (error) {
      console.error('Error updating stream config:', error);
      res.status(500).json({ message: 'Error updating stream configuration' });
    }
  },

  // Delete a stream configuration
  deleteConfig: async (req, res) => {
    try {
      const config = await StreamConfig.findById(req.params.id);
      
      if (!config) {
        return res.status(404).json({ message: 'Stream configuration not found' });
      }

      await config.deleteOne();
      res.json({ message: 'Stream configuration deleted successfully' });
    } catch (error) {
      console.error('Error deleting stream config:', error);
      res.status(500).json({ message: 'Error deleting stream configuration' });
    }
  }
};

module.exports = configController;
