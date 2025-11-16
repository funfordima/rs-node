import { CreateGameResponse, GameData, RoomUser } from '../types/wss.type.js';
import { gameModel } from '../models/game.model.js';

export const createGame = (user: RoomUser, gameId: string | number): CreateGameResponse => {
  const game = gameModel.createGame(user, gameId);

  return new CreateGameResponse(game);
};

export const findGameByUserId = (userId: string | number): GameData | undefined => {
  return gameModel.findGameByUserId(userId);
};

export const findGameByGameId = (gameId: string | number): GameData | undefined => {
  return gameModel.findGameByUserId(gameId);
};
