import { randomUUID } from 'crypto';

import { RoomData, RoomUser } from '../types/wss.type.js';

const rooms: RoomData[] = [];

export const roomModel = {
  createRoom(user: RoomUser): RoomData | null {
    const existentRoom = rooms.find(r => r.roomUsers.some(u => u.index == user.index));

    if (existentRoom) {
      return null;
    }

    const room: RoomData = {
      roomId: randomUUID(),
      roomUsers: [user],
    };

    rooms.push(room);

    return room;
  },

  getRoom: (indexRoom: string | number): RoomData | undefined => {
    return rooms.find(r => r.roomId == indexRoom);
  },

  getFreeRooms(): RoomData[] {
    return rooms.filter((room) => room.roomUsers.length === 1);
  },

  addUserToRoom(roomId: string | number, user: RoomUser): RoomData | null {
    const room = rooms.find(r => r.roomId === roomId);

    if (!room || room.roomUsers.some(u => u.index === user.index) || room.roomUsers.length >= 2) {
      return null;
    }

    room.roomUsers.push(user);

    return room;
  },
};
