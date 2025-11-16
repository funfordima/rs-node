import { Ship } from '../types/wss.type.js';

export const createGameMap = (ships: Ship[]): number[][] => {
  const map: number[][] = Array.from({ length: 10 }, () => Array(10).fill(0));

  ships.forEach((ship) => {
    const { x, y } = ship.position;
    const { length, direction } = ship;

    for (let i = 0; i < length; i++) {
      if (direction) {
        map[y + i]![x] = 1;
      } else {
        map[y]![x + i] = 1;
      }
    }
  });

  return map;
};

export const checkWinnerMap = (map: number[][]) => {
  const result = map.reduce((acc, row) => acc + row.filter((cell) => cell === 2).length, 0);

  return result >= 20;
};
