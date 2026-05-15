#!/usr/bin/env python3
"""
Qutebrowser Dashboard Server - With System Stats API
Serves static files + provides real-time system stats via /api/stats
"""

import os
import json
import psutil
import mimetypes
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

DASHBOARD_DIR = Path(__file__).parent / 'dashboard'
HARDWARE_INFO = {
    "cpu": "AMD Ryzen 9 7950X3D (16) @ 5.7GHz",
    "gpu": ["RTX 4090 24GB", "RX 7900 XTX 24GB", "RX 7900 XTX 24GB"]
}

class DashboardHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # API endpoint
        if path == '/api/stats':
            try:
                cpu_percent = psutil.cpu_percent(interval=0.1)
                ram = psutil.virtual_memory()
                
                stats = {
                    "cpu": round(cpu_percent, 1),
                    "ram": round(ram.percent, 1),
                    "hardware": HARDWARE_INFO
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(stats).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            # Serve static files
            if path == '/':
                path = '/dashboard/index.html'
            
            file_path = DASHBOARD_DIR.parent / path.lstrip('/')
            
            if file_path.is_file():
                try:
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    
                    mime_type, _ = mimetypes.guess_type(str(file_path))
                    if mime_type is None:
                        mime_type = 'application/octet-stream'
                    
                    self.send_response(200)
                    self.send_header('Content-Type', mime_type)
                    self.send_header('Content-Length', len(content))
                    self.end_headers()
                    self.wfile.write(content)
                except Exception as e:
                    self.send_response(500)
                    self.end_headers()
            else:
                self.send_response(404)
                self.end_headers()
    
    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 9999), DashboardHandler)
    print('🚀 Dashboard Server running on http://127.0.0.1:9999')
    print('📁 Serving: /dashboard')
    print('📊 API: /api/stats')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n✅ Server stopped')
