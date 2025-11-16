import { Ships, ShipsData } from '../types/wss.type.js';

const shipStore: ShipsData[] = [];

export const shipsModel = {
  addShips(gameId: number | string, ships: Ships[], userId: number | string): ShipsData {
    const ship = shipStore.find(s => s.gameId == gameId && s.indexPlayer == userId);

    if (ship) {
      ship.ships = ships;

      return ship;
    }

    const newShip: ShipsData = {
      gameId,
      ships,
      indexPlayer: userId,
    };

    shipStore.push(newShip);

    return newShip;
  },
};
