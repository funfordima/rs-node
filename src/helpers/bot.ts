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
