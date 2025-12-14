const TelemetryPoint = require("../models/TelemetryPoint");

// Get telemetry data with optional filtering and aggregation
const getTelemetry = async (req, res) => {
  try {
    // Extract query parameters
    const { 
      streamKey, 
      sessionId, 
      limit = 1000, 
      startTime, 
      endTime,
      aggregate = 'none', // 'minute', 'hour', 'day', or 'none'
      streams // Comma-separated list of stream keys
    } = req.query;

    // Validate required fields
    if (!streamKey && !streams) {
      return res.status(400).json({ 
        message: 'Either streamKey or streams parameter is required' 
      });
    }

    // Build query filter
    const filter = {};
    
    // Handle multiple streams or single stream
    if (streams) {
      filter.streamKey = { $in: streams.split(',') };
    } else {
      filter.streamKey = streamKey;
    }
    
    if (sessionId) {
      filter.sessionId = sessionId;
    }

    // Add timestamp conditions if provided
    if (startTime || endTime) {
      filter.timestamp = {};
      
      if (startTime) {
        filter.timestamp.$gte = new Date(startTime);
      }
      
      if (endTime) {
        filter.timestamp.$lte = new Date(endTime);
      }
    }

    let result;
    
    if (aggregate !== 'none') {
      // Handle aggregation
      const aggregationPipeline = [
        { $match: filter },
        {
          $group: {
            _id: {
              $dateToString: { 
                format: getAggregationFormat(aggregate),
                date: "$timestamp"
              },
              streamKey: "$streamKey"
            },
            timestamp: { $first: "$timestamp" },
            min: { $min: "$value" },
            max: { $max: "$value" },
            avg: { $avg: "$value" },
            count: { $sum: 1 }
          }
        },
        { $sort: { timestamp: 1 } },
        { $limit: parseInt(limit, 10) }
      ];
      
      result = await TelemetryPoint.aggregate(aggregationPipeline);
      
      // Format the result to match the non-aggregated format
      result = result.map(item => ({
        streamKey: item._id.streamKey,
        timestamp: item.timestamp,
        value: item.avg, // or use min/max as needed
        aggregated: {
          min: item.min,
          max: item.max,
          avg: item.avg,
          count: item.count
        }
      }));
    } else {
      // Regular query without aggregation
      result = await TelemetryPoint.find(filter)
        .sort({ timestamp: 1 })
        .limit(parseInt(limit, 10));
    }

    // Return results
    res.json(result);
  } catch (error) {
    console.error('Error fetching telemetry:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get available streams for a session
const getAvailableStreams = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'sessionId is required' });
    }
    
    const streams = await TelemetryPoint.distinct('streamKey', { sessionId });
    
    res.json({
      sessionId,
      streams: streams.map(stream => ({
        key: stream,
        name: formatStreamName(stream),
        type: detectStreamType(stream),
        unit: detectStreamUnit(stream)
      }))
    });
  } catch (error) {
    console.error('Error fetching available streams:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get telemetry statistics
const getTelemetryStats = async (req, res) => {
  try {
    const { streamKey, sessionId, startTime, endTime } = req.query;
    
    if (!streamKey || !sessionId) {
      return res.status(400).json({ 
        message: 'streamKey and sessionId are required' 
      });
    }
    
    const filter = { streamKey, sessionId };
    
    if (startTime || endTime) {
      filter.timestamp = {};
      if (startTime) filter.timestamp.$gte = new Date(startTime);
      if (endTime) filter.timestamp.$lte = new Date(endTime);
    }
    
    const stats = await TelemetryPoint.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          min: { $min: "$value" },
          max: { $max: "$value" },
          avg: { $avg: "$value" },
          firstTimestamp: { $min: "$timestamp" },
          lastTimestamp: { $max: "$timestamp" }
        }
      }
    ]);
    
    res.json(stats[0] || {});
  } catch (error) {
    console.error('Error fetching telemetry stats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function to get MongoDB date format string for aggregation
function getAggregationFormat(aggregate) {
  switch (aggregate) {
    case 'minute':
      return '%Y-%m-%dT%H:%M:00.000Z';
    case 'hour':
      return '%Y-%m-%dT%H:00:00.000Z';
    case 'day':
      return '%Y-%m-%dT00:00:00.000Z';
    default:
      return '%Y-%m-%dT%H:%M:%S.%LZ';
  }
}

// Helper function to format stream names for display
function formatStreamName(streamKey) {
  return streamKey
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Helper function to detect stream type
function detectStreamType(streamKey) {
  const lowerKey = streamKey.toLowerCase();
  
  if (lowerKey.includes('temp') || lowerKey.includes('temperature')) {
    return 'temperature';
  }
  
  if (lowerKey.includes('cpu') || lowerKey.includes('usage')) {
    return 'percentage';
  }
  
  if (lowerKey.includes('memory') || lowerKey.includes('ram')) {
    return 'bytes';
  }
  
  if (lowerKey.includes('speed') || lowerKey.includes('velocity')) {
    return 'speed';
  }
  
  return 'number';
}

// Helper function to detect stream unit
function detectStreamUnit(streamKey) {
  const lowerKey = streamKey.toLowerCase();
  
  if (lowerKey.includes('temp') || lowerKey.includes('temperature')) {
    return '°C';
  }
  
  if (lowerKey.includes('cpu') || lowerKey.includes('usage') || lowerKey.includes('load')) {
    return '%';
  }
  
  if (lowerKey.includes('memory') || lowerKey.includes('ram')) {
    return 'MB';
  }
  
  if (lowerKey.includes('speed')) {
    return 'km/h';
  }
  
  return '';
}

module.exports = {
  getTelemetry,
  getAvailableStreams,
  getTelemetryStats
};
