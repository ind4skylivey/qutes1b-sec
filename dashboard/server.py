#!/usr/bin/env python3
"""
System Stats Server
Provides real-time CPU and RAM data via HTTP API
"""

import json
import logging
import psutil
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Only allow requests from localhost
ALLOWED_ORIGINS = {'http://127.0.0.1:9999', 'http://localhost:9999'}

class SystemStatsHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/stats':
            try:
                cpu_percent = psutil.cpu_percent(interval=0.1)
                ram = psutil.virtual_memory()
                
                stats = {
                    "cpu": round(cpu_percent, 1),
                    "ram": round(ram.percent, 1)
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                # Restrict CORS to localhost only
                origin = self.headers.get('Origin', '')
                if origin in ALLOWED_ORIGINS:
                    self.send_header('Access-Control-Allow-Origin', origin)
                self.end_headers()
                self.wfile.write(json.dumps(stats).encode())
            except Exception as e:
                logger.error(f"Stats API error: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Internal server error"}).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        self.send_response(204)
        origin = self.headers.get('Origin', '')
        if origin in ALLOWED_ORIGINS:
            self.send_header('Access-Control-Allow-Origin', origin)
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()
    
    def log_message(self, format, *args):
        pass  # Silence logs

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 5000), SystemStatsHandler)
    logger.info('System Stats Server running on http://127.0.0.1:5000')
    logger.info('Available endpoints: /api/stats')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        logger.info('Server stopped')
