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

export const printGameMap = (map: number[][], indexPlayer: number): void => {
  console.log("Card game for player", indexPlayer);
  console.log("  0 1 2 3 4 5 6 7 8 9");

  map.forEach((row, y) => {
    console.log(`${y} ${row.join(" ")}`);
  });
  
  console.log("\n");
};
