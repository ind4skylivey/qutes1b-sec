#!/usr/bin/env python3
"""
Qutebrowser Dashboard Server - With System Stats API
Serves static files + provides real-time system stats via /api/stats
"""

import os
import json
import logging
import psutil
import mimetypes
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, unquote

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

DASHBOARD_DIR = Path(__file__).parent / 'dashboard'
ALLOWED_ORIGINS = {'http://127.0.0.1:9999', 'http://localhost:9999'}

def sanitize_path(requested_path: str) -> Path | None:
    """
    Sanitize and validate requested path to prevent directory traversal.
    Returns resolved Path if valid, None if path traversal detected.
    """
    # Decode URL-encoded characters multiple times to prevent double-encoding bypass
    decoded = requested_path
    for _ in range(3):  # Decode up to 3 times
        prev = decoded
        decoded = unquote(decoded)
        if decoded == prev:
            break
    decoded = decoded.lstrip('/')
    
    # Reject paths with traversal patterns
    if '..' in decoded.split('/') or '..' in decoded.split('\\'):
        return None
    
    # Resolve the path and verify it stays within DASHBOARD_DIR.parent
    base = DASHBOARD_DIR.parent.resolve()
    target = (base / decoded).resolve()
    
    # Ensure resolved path is under the base directory
    try:
        target.relative_to(base)
    except ValueError:
        return None
    
    return target

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
            # Serve static files with path traversal protection
            if path == '/':
                path = '/dashboard/index.html'
            
            file_path = sanitize_path(path)
            
            if file_path is None:
                logger.warning(f"Path traversal attempt blocked: {path}")
                self.send_response(403)
                self.end_headers()
                return
            
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
                    logger.error(f"File serve error: {e}")
                    self.send_response(500)
                    self.end_headers()
            else:
                self.send_response(404)
                self.end_headers()
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(204)
        origin = self.headers.get('Origin', '')
        if origin in ALLOWED_ORIGINS:
            self.send_header('Access-Control-Allow-Origin', origin)
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.send_header('Access-Control-Max-Age', '86400')
        self.end_headers()
    
    def log_message(self, format, *args):
        # Suppress default logging, we use our own logger
        pass

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 9999), DashboardHandler)
    logger.info('Dashboard Server running on http://127.0.0.1:9999')
    logger.info('Serving: /dashboard')
    logger.info('API: /api/stats')
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        logger.info('Server stopped')
