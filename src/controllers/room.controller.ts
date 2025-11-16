import { RoomData, RoomUser, UpdateRoomResponse } from '../types/wss.type.js';
import { roomModel } from '../models/room.model.js';

export const updateRoom = (): UpdateRoomResponse => {
  const rooms: RoomData[] = roomModel.getFreeRooms();

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
