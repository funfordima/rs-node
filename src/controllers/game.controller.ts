import { CreateGameResponse, RoomUser } from '../types/wss.type.js';
import { gameModel } from '../models/game.model.js';

export const createGame = (user: RoomUser): CreateGameResponse => {
  const game = gameModel.createGame(user);

  return new CreateGameResponse(game);
};
