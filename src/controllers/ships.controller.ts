import { Ship } from '../types/wss.type.js';
import { shipsModel } from '../models/ships.model.js';


export const addShips = (gameId: number | string, ships: Ship[], userId: number | string) => {
  shipsModel.addShips(gameId, ships, userId);
};

export const getUserShips = (gameId: number | string, currentPlayerIndex: number | string): Ship[] | null => {
  return getUserShips(gameId, currentPlayerIndex);
};
