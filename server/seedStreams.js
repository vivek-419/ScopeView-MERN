const mongoose = require('mongoose');
const dotenv = require('dotenv');
const StreamConfig = require('./models/StreamConfig');

// Load environment variables
dotenv.config();

const defaultStreams = [
  {
    streamKey: 'cpu_usage',
    name: 'CPU Usage',
    color: '#00aaff',
    minValue: 10,
    maxValue: 90,
    unit: '%',
    isVisible: true
  },
  {
    streamKey: 'memory_usage',
    name: 'Memory Usage',
    color: '#ff4444',
    minValue: 20,
    maxValue: 80,
    unit: '%',
    isVisible: true
  },
  {
    streamKey: 'network_in',
    name: 'Network In',
    color: '#44ff44',
    minValue: 5,
    maxValue: 50,
    unit: 'Mbps',
    isVisible: true
  },
  {
    streamKey: 'network_out',
    name: 'Network Out',
    color: '#ffaa00',
    minValue: 5,
    maxValue: 40,
    unit: 'Mbps',
    isVisible: true
  },
  {
    streamKey: 'disk_read',
    name: 'Disk Read',
    color: '#ff44ff',
    minValue: 1,
    maxValue: 30,
    unit: 'MB/s',
    isVisible: true
  },
  {
    streamKey: 'disk_write',
    name: 'Disk Write',
    color: '#44ffff',
    minValue: 1,
    maxValue: 25,
    unit: 'MB/s',
    isVisible: true
  },
  {
    streamKey: 'tire_temperature',
    name: 'Tire Temperature',
    color: '#ff8800',
    minValue: 60,
    maxValue: 120,
    unit: '°C',
    isVisible: true
  }
];

async function seedStreams() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/scopeviewion';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if streams already exist
    const existingCount = await StreamConfig.countDocuments();
    console.log(`Found ${existingCount} existing stream configurations`);

    // Seed each stream
    let added = 0;
    let skipped = 0;

    for (const stream of defaultStreams) {
      const existing = await StreamConfig.findOne({ streamKey: stream.streamKey });
      
      if (existing) {
        // Update existing record to include unit
        existing.unit = stream.unit;
        await existing.save();
        console.log(`🔄 Updated: ${stream.name} (added unit: ${stream.unit})`);
        
        // Count as updated/skipped logic could be adjusted
        skipped++; 
      } else {
        await StreamConfig.create(stream);
        console.log(`✅ Added: ${stream.name}`);
        added++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   Added: ${added} streams`);
    console.log(`   Skipped: ${skipped} streams`);
    console.log(`   Total: ${await StreamConfig.countDocuments()} streams in database`);

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedStreams();
