import http, { IncomingMessage, ServerResponse } from 'http';
import { WebSocketServer } from 'ws';

import { messageType } from '../constants/message.enum.js';
import { ErrorResponse, RegistrationResponse, IncomingMessageRequest } from 'src/types/wss.type.js';
import { regUser } from '../controllers/user.controller.js';

export const createServer = (port: number) => {
  const server = http.createServer((_: IncomingMessage, res: ServerResponse) => {
    res.end('Init the app!');
  });

  const wss = new WebSocketServer({ server });

  server.listen(port);

  wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (message) => {
      const request = JSON.parse(message.toString()) as IncomingMessageRequest;

      try {
        switch(request.type) {
          case messageType.REG: {
            const { name, password } = JSON.parse(request.data.toString());
            const response: RegistrationResponse = regUser(name, password);

            ws.send(JSON.stringify(response));
            break;
          }

          case messageType.CREATE_ROOM: {

            ws.send(JSON.stringify({}));
            break;
          }

          case messageType.UPDATE_ROOM: {

            ws.send(JSON.stringify({}));
            break;
          }
        }
      } catch (error) {
        const errorResponse: ErrorResponse = new ErrorResponse(
          {
            name: '',
            index: 0,
            error: true,
            errorText: `Network error: ${error}`,
          }
        );

        ws.send(JSON.stringify(errorResponse));
      }
    });
  });

  return { server, wss };
};
