import { randomUUID } from 'crypto';

import { RoomRequestData, RoomUser } from '../types/wss.type.js';

const rooms: RoomRequestData[] = [];

export const roomModel = {
  createRoom(user: RoomUser): RoomRequestData {
    const room: RoomRequestData = {
      roomId: randomUUID(),
      roomUsers: [user],
    };

    rooms.push(room);

    return room;
  },

  getFreeRooms(): RoomRequestData[] {
    return rooms.filter((room) => room.roomUsers.length === 1);
  },
};
