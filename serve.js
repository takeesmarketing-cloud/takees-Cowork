const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = 8000;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf'
};

http.createServer((req, res) => {
  const rawUrl = req.url || '/';
  const safeUrl = decodeURIComponent(rawUrl.split('?')[0]);
  let filePath = safeUrl === '/' ? path.join(root, 'index.html') : path.join(root, safeUrl);

  // Homepage sections: /home /about /amenities /plan /contact
  if (/^\/(home|about|amenities|plan|contact)$/.test(safeUrl)) filePath = path.join(root, 'index.html');
  // Clean URLs: /places-to-visit-in-Kannur serves places-to-visit-in-Kannur.html
  if (!path.extname(filePath) && fs.existsSync(filePath + ".html")) filePath += ".html";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
