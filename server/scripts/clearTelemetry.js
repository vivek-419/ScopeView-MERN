const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TelemetryPoint = require('../models/TelemetryPoint');

dotenv.config({ path: '../.env' }); // Adjust path if running from server dir

const clearTelemtry = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is undefined. Check your .env file.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected.');

    console.log('🗑️ Deleting all telemetry points...');
    const result = await TelemetryPoint.deleteMany({});
    
    console.log(`✅ Deleted ${result.deletedCount} telemetry records.`);
    console.log('💾 Space should now be reclaimed.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
};

clearTelemtry();
