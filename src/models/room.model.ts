import { RoomData, RoomUser, Ship } from '../types/wss.type.js';

interface ShipsState {
  x: number;
  y: number;
  status: 'miss' | 'killed' | 'shot';
}

export interface RoomModel extends RoomData {
  roomId: string | number;
  roomUsers : RoomUser[];
  ships?: {
    [key: string]: Ship[];
  };
  turnUserId?: number;
  shipsState?: {
    [key: string]: ShipsState[];
  };
  gameMaps?: {
    [key: string]: number[][];
  };
}

let roomId = 0;
const rooms: RoomModel[] = [];

export const roomModel = {
  createRoom(user: RoomUser): RoomModel | null {
    const existentRoom = rooms.find(r => r.roomUsers.some(u => u.index == user.index));

    if (existentRoom) {
      return null;
    }

    const room: RoomModel = {
      roomId: ++roomId,
      roomUsers: [user],
      turnUserId: user.index,
      shipsState: {},
    };

    console.log(room);

    // const room: RoomData = {
    //   roomId: randomUUID(),
    //   roomUsers: [user],
    // };

    rooms.push(room);

    return room;
  },

  getRoom: (indexRoom: string | number): RoomModel | undefined => {
    return rooms.find(r => r.roomId == indexRoom);
  },

  getRooms: (): RoomModel[] => {
    return rooms;
  },

  getFreeRooms(): RoomModel[] {
    return rooms.filter((room) => room.roomUsers.length === 1);
  },

  addUserToRoom(roomId: string | number, user: RoomUser) {
    rooms.forEach(r => {
      if (r.roomId === roomId && !r.roomUsers.some(u => u.index === user.index) && r.roomUsers.length < 2) {
        r.roomUsers.push(user);
      }
    });
  },

  removeRoomUser(user: RoomUser) {
    for (const room of rooms) {
      const idx = room.roomUsers.findIndex(u => u.index === user.index);
        
      if (idx >= 0) {
        room.roomUsers.splice(idx, 1);
      }
    }
  },
};
