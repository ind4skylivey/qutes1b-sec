#!/usr/bin/env python3
"""
System Stats Server
Provides real-time CPU and RAM data via HTTP API
"""

import json
import psutil
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

HARDWARE_INFO = {
    "cpu": "AMD Ryzen 9 7950X3D (16) @ 5.7GHz",
    "gpu": ["RTX 4090 24GB", "RX 7900 XTX 24GB", "RX 7900 XTX 24GB"]
}

class SystemStatsHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/stats':
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
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        pass  # Silence logs

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 5000), SystemStatsHandler)
    print('System Stats Server running on http://127.0.0.1:5000')
    print('Available endpoints: /api/stats')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServer stopped')
