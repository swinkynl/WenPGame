# Kleine webserver voor het spel. Zet caching uit, zodat je altijd de nieuwste versie ziet.
import http.server
import sys


class GeenCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


poort = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
http.server.ThreadingHTTPServer(('', poort), GeenCache).serve_forever()
