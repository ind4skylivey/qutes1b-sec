#!/bin/bash
# Quick test script for Qutebrowser Dashboard

set -euo pipefail

echo "🧪 Testing Qutebrowser Dashboard"
echo "================================="
echo ""

# Test 1: Server Running
echo "✅ Test 1: Checking if server is running..."
if pgrep -f "dashboard-server.py" > /dev/null; then
    PID=$(pgrep -f "dashboard-server.py")
    echo "   ✓ Server running (PID: $PID)"
else
    echo "   ✗ Server not running!"
    exit 1
fi
echo ""

# Test 2: Port Listening
echo "✅ Test 2: Checking if port 9999 is listening..."
if ss -tulpn 2>/dev/null | grep 9999 > /dev/null; then
    echo "   ✓ Port 9999 is open"
else
    echo "   ✗ Port 9999 is NOT listening!"
    exit 1
fi
echo ""

# Test 3: Dashboard File Exists
echo "✅ Test 3: Checking if dashboard file exists..."
DASHBOARD_HTML="${HOME}/.config/qutebrowser/dashboard/index.html"
if [ -f "$DASHBOARD_HTML" ]; then
    SIZE=$(wc -c < "$DASHBOARD_HTML")
    echo "   ✓ index.html exists ($SIZE bytes)"
else
    echo "   ✗ index.html not found!"
    exit 1
fi
echo ""

# Test 4: Dashboard Accessible
echo "✅ Test 4: Testing if dashboard is accessible..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9999/dashboard/index.html)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✓ Dashboard is accessible (HTTP 200)"
else
    echo "   ✗ Dashboard not accessible! (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test 5: HTML Content
echo "✅ Test 5: Checking HTML content..."
if curl -s http://localhost:9999/dashboard/index.html | grep -q "S1BGr0up"; then
    echo "   ✓ HTML contains 'S1BGr0up' (correct branding)"
else
    echo "   ✗ HTML content issue!"
    exit 1
fi
echo ""

# Test 6: JavaScript Modules
echo "✅ Test 6: Checking JavaScript modules..."
MODULES=("main.js" "utils.js" "clocks.js" "terminal.js" "todo.js" "widgets.js" "effects.js" "system-stats.js")
ALL_OK=true

for module in "${MODULES[@]}"; do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:9999/dashboard/js/$module")
    if [ "$HTTP_CODE" = "200" ]; then
        echo "   ✓ $module accessible"
    else
        echo "   ✗ $module NOT accessible! (HTTP $HTTP_CODE)"
        ALL_OK=false
    fi
done

if [ "$ALL_OK" = false ]; then
    exit 1
fi
echo ""

# Test 7: CSS File
echo "✅ Test 7: Checking CSS file..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9999/dashboard/css/main.css)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✓ main.css accessible"
else
    echo "   ✗ main.css NOT accessible! (HTTP $HTTP_CODE)"
    exit 1
fi
echo ""

# Test 8: Console Test
echo "✅ Test 8: Testing server response..."
RESPONSE=$(curl -s http://localhost:9999/dashboard/index.html)
if echo "$RESPONSE" | grep -q "<!DOCTYPE html>"; then
    echo "   ✓ HTML is valid"
else
    echo "   ✗ HTML is NOT valid!"
    exit 1
fi
echo ""

# Summary
echo "================================="
echo "🎉 ALL TESTS PASSED!"
echo ""
echo "📊 Dashboard URLs:"
echo "   Main:  http://localhost:9999/dashboard/index.html"
echo "   Access: http://localhost:9999/dashboard/"
echo ""
echo "🔧 To start server:"
echo "   cd ~/.config/qutebrowser && ./start-dashboard-server.sh"
echo ""
echo "📋 To test in qutebrowser:"
echo "   :o http://localhost:9999/dashboard/index.html"
echo ""
echo "✨ Ready to use!"
