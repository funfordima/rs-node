import { WebSocket } from 'ws';

import { AttackResponse, AttackResponseData, FinishResponse, Ship, TurnResponse } from '../types/wss.type.js';
import { checkWinnerMap } from './utils.js';

export const generateRandomAttack = (
  map: number[][]
): { x: number; y: number } => {
  const availableCells: { x: number; y: number }[] = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y]!.length; x++) {
      if (map[y]![x] !== 2) {
        availableCells.push({ x, y });
      }
    }
  }

  if (availableCells.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCells.length);

    return availableCells[randomIndex]!;
  }

  return { x: 0, y: 0 };
};

export const makeComputerMove = (
  ws: WebSocket,
  gameId: string,
  singleGame: {
    id: string;
    playerIndex: number;
    computerIndex: number;
    playerMap: number[][];
    computerMap: number[][];
    computerShips: Ship[];
    currentTurn: number;
  },
  singlePlayerGames: Map<string,
    {
      id: string;
      playerIndex: number;
      computerIndex: number;
      playerMap: number[][];
      computerMap: number[][];
      computerShips: Ship[];
      currentTurn: number;
    }
  >
) => {
  const { x, y } = generateRandomAttack(singleGame.playerMap);

  let status: AttackResponseData['status'] = 'miss';

  if (singleGame.playerMap[y]![x] === 1) {
    singleGame.playerMap[y]![x] = 2;
    status = 'shot';

    if (checkWinnerMap(singleGame.playerMap)) {
      const finishResponse = new FinishResponse({ winPlayer: singleGame.computerIndex });
      
      ws.send( JSON.stringify(finishResponse));

      singlePlayerGames.delete(gameId);

      return;
    }
  }

  const attackResponse = new AttackResponse({
    position: { x, y },
    currentPlayer: singleGame.computerIndex,
    status: status,
  });

  ws.send(JSON.stringify(attackResponse));

  if (status === 'shot') {
    singleGame.currentTurn = singleGame.computerIndex;

    setTimeout(() => makeComputerMove(ws, gameId, singleGame, singlePlayerGames), 1000);
  } else {
    singleGame.currentTurn = singleGame.playerIndex;

    const turnResponse = new TurnResponse({ currentPlayer: singleGame.currentTurn });
    
    ws.send(JSON.stringify(turnResponse));
  }
};

export const generateComputerShips = (): Ship[] => {
  const ships: Ship[] = [];
  const shipLengths = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

  for (const length of shipLengths) {
    let placed = false;

    while (!placed) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const direction = Math.random() > 0.5;

      let canPlace = true;

      for (let i = 0; i < length; i++) {
        const checkX = direction ? x : x + i;
        const checkY = direction ? y + i : y;

        if (checkX >= 10 || checkY >= 10) {
          canPlace = false;

          break;
        }

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = checkX + dx;
            const ny = checkY + dy;

            if (nx >= 0 && nx < 10 && ny >= 0 && ny < 10) {
              if (
                ships.some((ship) => {
                  for (let j = 0; j < ship.length; j++) {
                    const shipX = ship.direction
                      ? ship.position.x
                      : ship.position.x + j;
                    const shipY = ship.direction
                      ? ship.position.y + j
                      : ship.position.y;

                    if (shipX === nx && shipY === ny) {
                      return true;
                    }
                  }

                  return false;
                })
              ) {
                canPlace = false;

                break;
              }
            }
          }

          if (!canPlace) {
            break;
          }
        }

        if (!canPlace) {
            break;
          }
      }

      if (canPlace) {
        ships.push({
          position: { x, y },
          direction,
          length,
          type: 'small',
        });
        
        placed = true;
      }
    }
  }

  return ships;
};
