import 'dotenv/config';

import { httpServer } from './src/http_server/index.js';

import { createServer } from './src/server/server.js';

const HTTP_PORT = process.env.HTTP_PORT || 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const WSS_PORT = process.env.WSS_PORT || 3030;

console.log(`Start wss server on the ${WSS_PORT} port!`);

const { wss } = createServer(+WSS_PORT);

process.on('SIGINT', () => {
  wss.close(() => {
    console.log('WebSocket server closed.');

    httpServer.close(() => {
      console.log('HTTP server closed.');

      process.exit(0);
    });
  });
});