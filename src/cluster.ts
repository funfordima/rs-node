import 'dotenv/config';

import cluster from 'node:cluster';
import http from 'http';
import { availableParallelism } from 'os';

const numCPUs = Math.max(availableParallelism() - 1, 1);
const BASE_PORT = Number(process.env.WORKER_PORT) || 4000;

if (process.env.MULTI === "true" && cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Starting ${numCPUs} workers...`);

  const workers: { id: number; port: number }[] = [];

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork({ PORT: BASE_PORT + i + 1 });
    workers.push({ id: worker.id, port: BASE_PORT + i + 1 });
  }

  let currentIndex = 0;

  const balancer = http.createServer((req, res) => {
    const worker = workers[currentIndex];
    currentIndex = (currentIndex + 1) % workers.length;

    const proxy = http.request(
      {
        hostname: 'localhost',
        port: worker!.port,
        path: req.url,
        method: req.method,
        headers: req.headers
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      }
    );

    req.pipe(proxy, { end: true });
  });

  balancer.listen(BASE_PORT, () => {
    console.log(`Load balancer listening on port ${BASE_PORT}`);
  });

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  await import('./index.js');
}
