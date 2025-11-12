import http, { IncomingMessage, ServerResponse } from 'http';
import { WebSocketServer } from 'ws';

import { messageType } from '../constants/message.enum.js';
import { RegistrationRequest } from 'src/types/registration.js';

export const createServer = (port: number) => {
  const server = http.createServer((_: IncomingMessage, res: ServerResponse) => {
    res.end('Init the app!');
  });

  const wss = new WebSocketServer({ server });

  server.listen(port);

  wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (message) => {
      console.log('received: %s', message);

      const request = JSON.parse(message.toString()) as RegistrationRequest;

      switch(request.type) {
        case messageType.REG: {
          console.log(request.type, request.data);
          break;
        }
      }
    });
  });

  return { server, wss };
};
