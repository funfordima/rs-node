import { WebSocketServer } from 'ws';

import { RoomUser, UpdateRoomResponse } from '../types/wss.type.js';
import { RoomModel, roomModel } from '../models/room.model.js';

export const updateRoom = (): UpdateRoomResponse => {
  const rooms: RoomModel[] = roomModel.getFreeRooms();

  const response = new UpdateRoomResponse(rooms);

  return response;
};

export const createRoom = (user: RoomUser) => {
  roomModel.createRoom(user);
};

export const addUserToRoom = (roomId: string | number, user: RoomUser) => {
  roomModel.addUserToRoom(roomId, user);
};

export const getRoom = (roomId: number | string) => {
  return roomModel.getRoom(roomId);
};

export const removeRoomUser = (user: RoomUser) => {
  roomModel.removeRoomUser(user);
};

export const broadcastRooms = (wss: WebSocketServer) => {
  const freeRooms: UpdateRoomResponse = updateRoom();

  const responseData = {
    ...freeRooms,
    data: JSON.stringify(freeRooms.data),
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      console.log(responseData);
      client.send(JSON.stringify(responseData));
    }
  });
};
