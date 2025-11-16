import { Ships } from '../types/wss.type.js';
import { shipsModel } from '../models/ships.model.js';


export const addShips = (gameId: number | string, ships: Ships[], userId: number | string) => {
  shipsModel.addShips(gameId, ships, userId);
};
