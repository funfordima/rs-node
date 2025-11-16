import http, { IncomingMessage, ServerResponse } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

import { messageType } from '../constants/message.enum.js';
import {
  AddUserRoomRequestData,
  AttackRequestData,
  AttackResponse,
  AttackResponseData,
  ErrorResponse,
  FinishResponse,
  IncomingMessageRequest,
  RandomAttackData,
  RegistrationRequestData,
  RegistrationResponse,
  RoomUser,
  Ship,
  ShipsData,
  StartGameResponse,
  TurnResponse,
  UpdateRoomResponse,
} from '../types/wss.type.js';
import { getUserIndex, hasUser, regUser } from '../controllers/user.controller.js';
import { createRoom, updateRoom, addUserToRoom, removeRoomUser, broadcastRooms, getRoom } from '../controllers/room.controller.js';
import { addWinner, broadcastWinners, getWinners } from '../controllers/winners.controllers.js';
import { createGame } from '../controllers/game.controller.js';
import { checkWinnerMap, createGameMap } from '../helpers/utils.js';
import { generateRandomAttack, makeComputerMove } from '../helpers/bot.js';

const connections = new Map<WebSocket, RoomUser>();

let singlePlayerGames = new Map<
  string,
  {
    id: string;
    playerIndex: number;
    computerIndex: number;
    playerMap: number[][];
    computerMap: number[][];
    computerShips: Ship[];
    currentTurn: number;
  }
>();


export const createServer = (port: number) => {
  const server = http.createServer((_: IncomingMessage, res: ServerResponse) => {
    res.end('Init the app!');
  });

  const wss = new WebSocketServer({ server, maxPayload: 10_000});

  server.listen(port);

  wss.on('connection', (ws) => {
    let currentUser: RoomUser | null = null;

    console.log('Client connected');

    ws.on('error', console.error);

    ws.on('close', () => {
      console.log('Client disconnected');

      const user: RoomUser | undefined = connections.get(ws);

      if (user) {
        removeRoomUser(user);
      }

      connections.delete(ws);

      const freeRooms: UpdateRoomResponse = updateRoom();

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(freeRooms));
        }
      });
    });

    ws.on('message', async (message) => {
      let raw: string;

      if (typeof message === "string") {
        raw = message;
      } else if (message instanceof Buffer) {
        raw = message.toString("utf8");
      } else if (message instanceof ArrayBuffer) {
        raw = Buffer.from(message).toString("utf8");
      } else if (ArrayBuffer.isView(message)) { 
        raw = Buffer.from(message.buffer).toString("utf8");
      } else if (message instanceof Blob) {
        raw = Buffer.from(await message.arrayBuffer()).toString("utf8");
      } else {
        console.error("Unknown message format:", message);
        return;
      }

      console.log("Decoded raw message:", raw);

      let request: IncomingMessageRequest;

      try {
        request = JSON.parse(raw) as IncomingMessageRequest;
      } catch (error) {
        const errorResponse: ErrorResponse = new ErrorResponse(
        {
          name: '',
          index: 0,
          error: true,
          errorText: 'Invalid JSON.',
        });

        ws.send(JSON.stringify(errorResponse));

        return;
      }

      try {
        switch(request.type) {
          case messageType.REG: {
            const data = JSON.parse(request.data.toString());

            const { name, password } = data as RegistrationRequestData;
            
            const isUserExists = hasUser(name);

            if (!isUserExists) {
              regUser(name, password);
            }

            const userIndex = getUserIndex(name, password);
            
            if (userIndex < 0) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: 'invalid credentials.',
              });

              ws.send(JSON.stringify(errorResponse));

              return;
            }

            const response: RegistrationResponse = regUser(name, password);

            const responseData = {
              ...response,
              data: JSON.stringify(response.data),
            };

            currentUser = { name, index: userIndex } as RoomUser;

            connections.set(ws, { name, index: userIndex });

            ws.send(JSON.stringify(responseData));
            broadcastRooms(wss);
            broadcastWinners(wss);
            
            break;
          }

          case messageType.CREATE_ROOM: {
            if (!currentUser) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: 'User not found.',
              });

              ws.send(JSON.stringify(errorResponse));
              
              return;
            }
            
            createRoom(currentUser);
            broadcastRooms(wss);
            broadcastWinners(wss);
            

            break;
          }

          case messageType.ADD_USER: {
            if (!currentUser) {
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
            
            const data = JSON.parse(request.data.toString());
            
            const { indexRoom } = data as AddUserRoomRequestData;

            addUserToRoom(indexRoom, currentUser);

            broadcastRooms(wss);

             wss.clients.forEach((client) => {
              const user = connections.get(client);

              if (client.readyState === WebSocket.OPEN && user) {
                const request = createGame(user, indexRoom);

                const responseData = {
                  ...request,
                  data: JSON.stringify(request.data),
                };

                client.send(JSON.stringify(responseData));
              }
            });

            break;
          }

          case messageType.ADD_SHIPS: {
            if (!currentUser) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: 'User not found.',
              });

              ws.send(JSON.stringify(errorResponse));
              
              return;
            }

            const data = JSON.parse(request.data.toString());

            const { gameId, ships, indexPlayer } = data as ShipsData;

            if (!gameId) return;
            
            const singleGame = singlePlayerGames.get(gameId.toString());

            if (singleGame) {
              singleGame.playerMap = createGameMap(ships);

              const startGameResponse = new StartGameResponse({
                ships: ships,
                currentPlayerIndex: (currentUser as RoomUser).index,
              });

              const startGameResponseData = {
                ...startGameResponse,
                data: JSON.stringify(startGameResponse.data),
              };

              ws.send(JSON.stringify(startGameResponseData));

              const turnResponse = new TurnResponse({ currentPlayer: singleGame.currentTurn });

              const turnResponseData = {
                ...turnResponse,
                data: JSON.stringify(turnResponse.data),
              };

              ws.send(JSON.stringify(turnResponseData));

              break;
            }

            const room = getRoom(gameId);

            if (!room) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: 'Room not found.',
              });

              ws.send(JSON.stringify(errorResponse));

              break;
            }

            const roomUser = room.roomUsers.find((u) => u.index === (currentUser as RoomUser).index);

            if (!roomUser) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: 'User not in the room.',
              });

              ws.send(JSON.stringify(errorResponse));

              break;
            }

            if (!room.ships) {
              room.ships = {};
            }
            if (!room.gameMaps) {
              room.gameMaps = {};
            }
            if (!room.shipsState) {
              room.shipsState = {};
            }

            room.ships[(currentUser as RoomUser).index] = ships;
            room.shipsState[(currentUser as RoomUser).index] = [];
            room.gameMaps[(currentUser as RoomUser).index] = createGameMap(ships);

            if (room.ships && Object.keys(room.ships).length === 2) {
              Object.entries(room.ships).forEach(
                ([playerIndex, playerShips]) => {
                  wss.clients.forEach((client) => {
                    const user = connections.get(client);

                    if (client.readyState === WebSocket.OPEN && user && user.index == Number(playerIndex)) {
                      const startGameResponse = new StartGameResponse({
                        ships: playerShips,
                        currentPlayerIndex: Number(playerIndex),
                      });

                      const startGameResponseData = {
                        ...startGameResponse,
                        data: JSON.stringify(startGameResponse.data),
                      };

                      client.send(JSON.stringify(startGameResponseData));

                      const turnResponse = new TurnResponse({ currentPlayer: room.turnUserId! });

                      const turnResponseData = {
                        ...turnResponse,
                        data: JSON.stringify(turnResponse.data),
                      };

                      client.send(JSON.stringify(turnResponseData));
                    }
                  });
                }
              );
            }

            break;
          }

          case messageType.ATTACK: {
            if (!currentUser) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: 'User not found.',
              });

              ws.send(JSON.stringify(errorResponse));
              
              return;
            }

            const data = JSON.parse(request.data.toString());

            const { gameId, x, y, indexPlayer } = data as AttackRequestData;

            const singleGame = singlePlayerGames.get(gameId.toString());

            if (singleGame) {
              if (indexPlayer === singleGame.currentTurn) {
                let status: AttackResponseData['status'] = 'miss';

                if (singleGame.computerMap[y]![x] === 1) {
                  singleGame.computerMap[y]![x] = 2;

                  status = 'shot';

                  if (checkWinnerMap(singleGame.computerMap)) {
                    addWinner((currentUser as RoomUser).name);

                    const finishResponse = new FinishResponse({ winPlayer: (currentUser as RoomUser).index });

                    const finishResponseData = {
                      ...finishResponse,
                      data: JSON.stringify(finishResponse.data),
                    };

                    ws.send( JSON.stringify(finishResponseData));

                    const winnersResponse = getWinners();

                    const winnersResponseData = {
                      ...winnersResponse,
                      data: JSON.stringify(winnersResponse.data),
                    };

                    ws.send(JSON.stringify(winnersResponseData));

                    singlePlayerGames.delete(gameId.toString());
                    
                    break;
                  }
                }
                
                const attackResponse = new AttackResponse({
                  position: { x, y },
                  currentPlayer: (currentUser as RoomUser).index,
                  status: status,
                });

                const attackResponseData = {
                  ...attackResponse,
                  data: JSON.stringify(attackResponse.data),
                };

                ws.send(JSON.stringify(attackResponseData));

                if (status === 'miss') {
                  singleGame.currentTurn = singleGame.computerIndex;

                  setTimeout(() => {
                    makeComputerMove(ws, gameId.toString(), singleGame, singlePlayerGames);
                  }, 1000);
                } else {
                  singleGame.currentTurn = (currentUser as RoomUser).index;

                  const turnResponse = new TurnResponse({ currentPlayer: singleGame.currentTurn });

                  const turnResponseData = {
                    ...turnResponse,
                    data: JSON.stringify(turnResponse.data),
                  };
    
                  ws.send(JSON.stringify(turnResponseData));
                }
              }

              break;
            }

            const room = getRoom(gameId);

            if (!room) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: 'Room not found.',
              });

              ws.send(JSON.stringify(errorResponse));

              break;
            }

            const secondUser = room.roomUsers.find((user) => user.index !== indexPlayer);

            if (!secondUser) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: 'Second user not found.',
              });

              ws.send(JSON.stringify(errorResponse));

              break;
            }

            if (indexPlayer === room.turnUserId) {
              const mapGame = room.gameMaps![secondUser.index];

              if (!mapGame) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: 'Game map not found.',
              });

              ws.send(JSON.stringify(errorResponse));

              break;
            }

              let status: AttackResponseData['status'] = 'miss';

              if (mapGame[y]![x] === 1) {
                mapGame[y]![x] = 2;

                status = 'shot';
                
                if (checkWinnerMap(mapGame)) {
                  addWinner((currentUser as RoomUser).name);

                  wss.clients.forEach((client) => {
                    const finishResponse = new FinishResponse({ winPlayer: (currentUser as RoomUser).index });

                    const finishResponseData = {
                      ...finishResponse,
                      data: JSON.stringify(finishResponse.data),
                    };

                    client.send(JSON.stringify(finishResponseData));
                  });

                  const winnersResponse = getWinners();

                  const winnersResponseData = {
                    ...winnersResponse,
                    data: JSON.stringify(winnersResponse.data),
                  };

                  wss.clients.forEach((client) => client.send(JSON.stringify(winnersResponseData)));
                }
              }

              const attackResponse = new AttackResponse({
                position: { x, y },
                currentPlayer: (currentUser as RoomUser).index,
                status: status,
              });

              const attackResponseData = {
                ...attackResponse,
                data: JSON.stringify(attackResponse.data),
              };

              ws.send(JSON.stringify(attackResponseData));

              if (room) {
                if (secondUser) {
                  room.turnUserId = status === 'miss' ? secondUser.index : (currentUser as RoomUser).index;

                  wss.clients.forEach((client) => {
                    const turnResponse = new TurnResponse({ currentPlayer: room.turnUserId! });

                    const turnResponseData = {
                      ...turnResponse,
                      data: JSON.stringify(turnResponse.data),
                    };
    
                    client.send(JSON.stringify(turnResponseData));
                  });
                }
              }
            }

            break;
          }

          case messageType.RANDOM_ATTACK: {
            if (!currentUser) {
              const errorResponse: ErrorResponse = new ErrorResponse(
              {
                name: '',
                index: 0,
                error: true,
                errorText: 'User not found.',
              });

              ws.send(JSON.stringify(errorResponse));
              
              return;
            }

            const data = JSON.parse(request.data.toString());

            const { gameId, indexPlayer } = data as RandomAttackData;

            const room = getRoom(gameId)!;

            const anotherUser = room.roomUsers.find(u => u.index !== indexPlayer)!;

            if (indexPlayer === room.turnUserId) {
              const mapGame = room.gameMaps![anotherUser.index]!;
              
              const { x, y } = generateRandomAttack(mapGame);

              let status: AttackResponseData['status'] = 'miss';

              if (mapGame[y]![x] === 1) {
                mapGame[y]![x] = 2;
                status = 'shot';

                if (checkWinnerMap(mapGame)) {
                  addWinner((currentUser as RoomUser).name);

                  wss.clients.forEach((client) => {
                    const finishResponse = new FinishResponse({ winPlayer: (currentUser as RoomUser).index });

                    const finishResponseData = {
                      ...finishResponse,
                      data: JSON.stringify(finishResponse.data),
                    };

                    client.send(JSON.stringify(finishResponseData));
                  });

                  const winnersResponse = getWinners();

                  const winnersResponseData = {
                    ...winnersResponse,
                    data: JSON.stringify(winnersResponse.data),
                  };

                  wss.clients.forEach((client) => client.send(JSON.stringify(winnersResponseData)));
                }
              }

              const attackResponse = new AttackResponse({
                position: { x, y },
                currentPlayer: (currentUser as RoomUser).index,
                status: status,
              });

              const attackResponseData = {
                ...attackResponse,
                data: JSON.stringify(attackResponse.data),
              };

              ws.send(JSON.stringify(attackResponseData));

              if (room) {
                if (anotherUser) {
                  room.turnUserId = status === 'miss' ? anotherUser.index : currentUser.index;

                  wss.clients.forEach((client) => {
                    const turnResponse = new TurnResponse({ currentPlayer: room.turnUserId! });

                    const turnResponseData = {
                      ...turnResponse,
                      data: JSON.stringify(turnResponse.data),
                    };
    
                    client.send(JSON.stringify(turnResponseData));
                  });
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Error handling message:", error);

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
