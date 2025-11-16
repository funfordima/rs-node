import { randomUUID } from 'crypto';

import { GameData, RoomUser, Ships } from '../types/wss.type.js';

const games: GameData[] = [];

export const gameModel = {
  createGame(user: RoomUser): GameData {
    const game: GameData = {
      idGame: randomUUID(),
      idPlayer: user.index,
    };

    games.push(game);

    return game;
  },

  addShips(gameId: number | string, ships: Ships[], userId: number | string) {
    
  },
};
