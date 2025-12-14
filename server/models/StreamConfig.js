const mongoose = require('mongoose');

const StreamConfigSchema = new mongoose.Schema({
  name: { type: String, required: true },
  streamKey: { type: String, required: true, unique: true },
  color: { type: String, required: true, default: '#00aaff' },
  minValue: { type: Number, default: 0 },
  maxValue: { type: Number, default: 100 },
  unit: { type: String, default: '' },
  isVisible: { type: Boolean, default: true },
  ownerTeam: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model("StreamConfig", StreamConfigSchema);
