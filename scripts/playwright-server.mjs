import { createServer } from 'node:http';
import next from 'next';

const app = next({ dev: false, hostname: '127.0.0.1', port: 3000 });
await app.prepare();
const handle = app.getRequestHandler();
const server = createServer((request, response) => handle(request, response));
server.listen(3000, '127.0.0.1');

function stop() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1000).unref();
}

process.on('SIGTERM', stop);
process.on('SIGINT', stop);
