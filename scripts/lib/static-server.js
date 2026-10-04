'use strict';
const http = require('node:http');
const { fs, path, ensureInside } = require('./workspace');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
function serve(root, port = 4174) {
  const server = http.createServer((req, res) => {
    try {
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end(); }
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let file = path.resolve(root, '.' + pathname); ensureInside(root, file);
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
      if (!TYPES[path.extname(file)]) { res.writeHead(403); return res.end('Unsupported static resource'); }
      const body = fs.readFileSync(file);
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)], 'Cache-Control': 'no-store' }); res.end(req.method === 'HEAD' ? undefined : body);
    } catch { res.writeHead(404); res.end('Not found'); }
  });
  server.listen(port, '127.0.0.1', () => console.log(`Static preview: http://127.0.0.1:${server.address().port}/`));
  return server;
}
module.exports = { serve };
