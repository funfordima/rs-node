import http, { IncomingMessage, ServerResponse } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

import { messageType } from '../constants/message.enum.js';
import {
  AddShipsRequest,
  AddUserRoomRequest,
  ErrorResponse,
  IncomingMessageRequest,
  RegistrationResponse,
  RoomUser,
  UpdateRoomResponse,
  UpdateWinnersResponse,
} from '../types/wss.type.js';
import { regUser } from '../controllers/user.controller.js';
import { createRoom, updateRoom, addUserToRoom, getRoom } from '../controllers/room.controller.js';
import { getWinners } from '../controllers/winners.controllers.js';
import { createGame } from '../controllers/game.controller.js';
import { addShips } from '../controllers/ships.controller.js';

const connections = new Map<WebSocket, RoomUser>();

export const createServer = (port: number) => {
  const server = http.createServer((_: IncomingMessage, res: ServerResponse) => {
    res.end('Init the app!');
  });

  const wss = new WebSocketServer({ server });

  server.listen(port);

  wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (message) => {
      const messageData = Buffer.isBuffer(message)
        ? message.toString()
        : message instanceof ArrayBuffer
        ? Buffer.from(message).toString()
        : message.toString();
      console.log("REceived:", messageData);

      const request = JSON.parse(messageData) as IncomingMessageRequest;

      try {
        switch(request.type) {
          case messageType.REG: {
            // console.log(2222, JSON.parse(request.data.toString()));
            const { name, password } = typeof request.data === 'string' 
              ? JSON.parse(request.data)
              : request.data;
            // console.log(result);

            // const { name, password } = { name: 'name', password: 'password'};
            const response: RegistrationResponse = regUser(name, password);
            const freeRooms: UpdateRoomResponse = updateRoom();
            const winners: UpdateWinnersResponse = getWinners();

            connections.set(ws, { name: response.data.name, index: response.data.index });

            ws.send(JSON.stringify(response));
            ws.send(JSON.stringify(freeRooms));
            ws.send(JSON.stringify(winners));

            // wss.clients.forEach(client => {
            //   if (client.readyState === WebSocket.OPEN) {
            //     client.send(JSON.stringify(freeRooms));
            //     client.send(JSON.stringify(winners));
            //   }
            // });
            break;
          }

          case messageType.CREATE_ROOM: {
            const user: RoomUser | undefined = connections.get(ws);

            if (!user || user.index < 0) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: `User not found.`,
              });

              ws.send(JSON.stringify(errorResponse));
              
              return;
            }

            createRoom(user!);

            const freeRooms: UpdateRoomResponse = updateRoom();
            const winners: UpdateWinnersResponse = getWinners();

            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(freeRooms));
                client.send(JSON.stringify(winners));
              }
            });
            
            break;
          }

          case messageType.UPDATE_ROOM: {

            // ws.send(JSON.stringify({}));
            break;
          }

          case messageType.ADD_USER: {
            const user: RoomUser | undefined = connections.get(ws);

            if (!user || user.index < 0) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: `User not found.`,
              });

              ws.send(JSON.stringify(errorResponse));
              
              return;
            }
            
            const { indexRoom } = (request as AddUserRoomRequest).data;

            addUserToRoom(indexRoom, user);

            const freeRooms: UpdateRoomResponse = updateRoom();
            // const winners: UpdateWinnersResponse = getWinners();

            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(freeRooms));
                // client.send(JSON.stringify(winners));

                const user: RoomUser | undefined = connections.get(ws);

                if (!!user && user.index >= 0) {
                  client.send(JSON.stringify(createGame(user)));
                }
              }
            });

            break;
          }

          case messageType.ADD_SHIPS: {
            const user: RoomUser | undefined = connections.get(ws);

            if (!user || user.index < 0) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: `User not found.`,
              });

              ws.send(JSON.stringify(errorResponse));
              
              return;
            }

            const { gameId, ships, indexPlayer } = (request as AddShipsRequest).data;

            const room = getRoom(gameId);

            if (!room) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: `Room not found.`,
              });

              ws.send(JSON.stringify(errorResponse));

              break;
            }

            const roomUser = room.roomUsers.find(u => u.index === indexPlayer);

            if (!roomUser || roomUser.index < 0) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: `User not found.`,
              });

              ws.send(JSON.stringify(errorResponse));
              
              return;
            }

            addShips(gameId, ships, indexPlayer);

            // ws.send(JSON.stringify({}));
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
