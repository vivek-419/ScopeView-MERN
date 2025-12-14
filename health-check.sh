#!/bin/bash
echo "=== ScopeView Health Check ==="
echo ""

echo "1. MongoDB Status:"
brew services list | grep mongodb-community
echo ""

echo "2. Server Health:"
curl -s http://localhost:4000/health | jq .
echo ""

echo "3. Server Database Status:"
curl -s http://localhost:4000/ | jq .database
echo ""

echo "4. Client Status:"
curl -s http://localhost:5173 > /dev/null && echo "✅ Client is running" || echo "❌ Client is not responding"
echo ""

echo "5. Telemetry Data Count:"
mongosh scopeviewion --quiet --eval "print('Total points:', db.telemetrypoints.countDocuments())"
echo ""

echo "=== Health Check Complete ==="
