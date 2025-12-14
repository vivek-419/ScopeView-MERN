const StreamConfig = require("../models/StreamConfig");

const streamController = {
  // Get all streams
  getStreams: async (req, res) => {
    try {
      const streams = await StreamConfig.find();
      res.json(streams);
    } catch (error) {
      console.error('Error fetching streams:', error);
      res.status(500).json({ message: 'Error fetching streams' });
    }
  },

  // Create a new stream
  createStream: async (req, res) => {
    try {
      const { name, key, color, min, max, ownerTeam } = req.body;
      
      // Validate required fields
      if (!name || !key || !color) {
        return res.status(400).json({ message: 'Name, key, and color are required' });
      }
      
      // Check for existing stream with same key
      const existing = await StreamConfig.findOne({ key });
      if (existing) {
        return res.status(409).json({ message: 'Stream key already exists' });
      }
      
      // Create new stream
      const created = await StreamConfig.create({ 
        name, 
        key, 
        color, 
        min, 
        max, 
        ownerTeam 
      });
      
      res.status(201).json(created);
    } catch (error) {
      console.error('Error creating stream:', error);
      res.status(500).json({ message: 'Error creating stream' });
    }
  },

  // Update an existing stream
  updateStream: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, key, color, min, max, ownerTeam } = req.body;
      
      const updated = await StreamConfig.findByIdAndUpdate(
        id,
        { name, key, color, min, max, ownerTeam },
        { new: true, runValidators: true }
      );
      
      if (!updated) {
        return res.status(404).json({ message: 'Stream not found' });
      }
      
      res.json(updated);
    } catch (error) {
      console.error('Error updating stream:', error);
      res.status(500).json({ message: 'Error updating stream' });
    }
  },

  // Delete a stream
  deleteStream: async (req, res) => {
    try {
      const { id } = req.params;
      
      const deleted = await StreamConfig.findByIdAndDelete(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Stream not found' });
      }
      
      res.json({ message: 'Stream deleted successfully' });
    } catch (error) {
      console.error('Error deleting stream:', error);
      res.status(500).json({ message: 'Error deleting stream' });
    }
  }
};

module.exports = streamController;
