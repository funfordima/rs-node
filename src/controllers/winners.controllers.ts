import { WebSocketServer } from 'ws';

import { UpdateWinnersResponse, WinnersData } from '../types/wss.type.js';
import { winnersModel } from '../models/winners.model.js';

export const getWinners = (): UpdateWinnersResponse => {
  const winners: WinnersData[] = winnersModel.getWinners();

  const response = new UpdateWinnersResponse(winners);

  return response;
};

export const addWinner = (name: string): WinnersData | null => {
  return winnersModel.addWinner(name);
};

export const broadcastWinners = (wss: WebSocketServer) => {
 const winners: UpdateWinnersResponse = getWinners();

 const responseData = {
  ...winners,
  data: JSON.stringify(winners.data),
};

wss.clients.forEach((client) => {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(responseData));
  }
});
};
