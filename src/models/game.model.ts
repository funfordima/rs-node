import { GameData, RoomUser } from '../types/wss.type.js';

const games: GameData[] = [];

export const gameModel = {
  createGame(user: RoomUser, gameId: string | number): GameData {
    const existentGame = this.findGameByUserId(user.index);

    if (existentGame) {
      return existentGame;
    }

    const game: GameData = {
      idGame: gameId,
      idPlayer: user.index,
    };

    games.push(game);

    return game;
  },

  findGameById(userId: string | number, gameId: string | number): GameData | undefined {
    return games.find(g => g.idPlayer === userId && g.idGame === gameId);
  },

  findGameByUserId(userId: string | number): GameData | undefined {
    return games.find(g => g.idPlayer === userId);
  },

  findGameByGameId(gameId: string | number): GameData | undefined {
    return games.find(g => g.idGame === gameId);
  },

  startGame() {

  },
};
