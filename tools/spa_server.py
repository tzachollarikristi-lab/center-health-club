#!/usr/bin/env python3
import os
from http.server import SimpleHTTPRequestHandler, HTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, '..', 'client', 'dist')

class SPAHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            self.path = '/index.html'
        return SimpleHTTPRequestHandler.send_head(self)

def run(port=3000):
    os.chdir(DIST)
    server = HTTPServer(('0.0.0.0', port), SPAHandler)
    print(f"Serving SPA on http://0.0.0.0:{port}")
    server.serve_forever()

if __name__ == '__main__':
    run()
