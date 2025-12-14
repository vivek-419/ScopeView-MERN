const mongoose = require('mongoose');

const TelemetryPointSchema = new mongoose.Schema({
  streamKey: { type: String, required: true },
  timestamp: { type: Date, required: true, index: true },
  value: { type: Number, required: true },
  sessionId: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("TelemetryPoint", TelemetryPointSchema);
