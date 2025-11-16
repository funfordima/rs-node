import { Ship, ShipsData } from '../types/wss.type.js';

const shipStore: ShipsData[] = [];

export const shipsModel = {
  addShips(gameId: number | string, ships: Ship[], userId: number | string): ShipsData {
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

  getUserShips(gameId: number | string, currentPlayerIndex: number | string): Ship[] | null {
    const ship = shipStore.find(s => s.gameId == gameId && s.indexPlayer == currentPlayerIndex);

    if (!ship) {
      return null;
    }

    return ship.ships;
  },
};
