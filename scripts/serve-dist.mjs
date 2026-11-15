// Minimal static file server for built sites (used by tests and local preview).
// Usage: node scripts/serve-dist.mjs <dir> [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json',
};

export function serve(dir, port = 0) {
  const rootDir = resolve(dir);
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://x').pathname);
      let file = normalize(join(rootDir, pathname));
      if (!file.startsWith(rootDir)) throw new Error('forbidden');
      if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain' });
      response.end('Not found');
    }
  });
  return new Promise((done) => {
    server.listen(port, '127.0.0.1', () => done({ server, port: server.address().port }));
  });
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const [dir, port] = process.argv.slice(2);
  if (!dir) {
    console.error('Usage: node scripts/serve-dist.mjs <dir> [port]');
    process.exit(1);
  }
  const { port: actual } = await serve(dir, Number(port) || 4321);
  console.log(`Serving ${dir} at http://127.0.0.1:${actual}/`);
}
