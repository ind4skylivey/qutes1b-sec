#!/bin/bash
# Qutebrowser Dashboard Server - With System Stats API
# Starts local HTTP server on port 9999 (serves dashboard + /api/stats)

cd /home/il1v3y/.config/qutebrowser

# Stop any existing server
pkill -f "python3.*dashboard-server.py" 2>/dev/null
pkill -f "python3 -m http.server 9999" 2>/dev/null

# Start new server
echo "🚀 Starting Qutebrowser Dashboard Server..."
python3 dashboard-server.py > /tmp/qute-dashboard-server.log 2>&1 &

# Wait for server to start
sleep 1

# Check if server is running
if ps aux | grep -v grep | grep "dashboard-server.py" > /dev/null; then
    echo "✅ Server started successfully!"
    echo ""
    echo "📊 Dashboard URL:"
    echo "   http://localhost:9999/dashboard/index.html"
    echo ""
    echo "📊 System Stats API:"
    echo "   http://localhost:9999/api/stats"
    echo ""
    echo "📋 Server Status:"
    echo "   Port: 9999"
    echo "   Process ID: $(ps aux | grep -v grep | grep 'dashboard-server.py' | awk '{print $2}')"
    echo ""
    echo "📜 Server Log:"
    tail -f /tmp/qute-dashboard-server.log
else
    echo "❌ Server failed to start!"
    echo "Check logs at: /tmp/qute-dashboard-server.log"
    exit 1
fi
