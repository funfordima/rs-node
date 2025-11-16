import { UpdateWinnersResponse, WinnersData } from '../types/wss.type.js';
import { winnersModel } from '../models/winners.model.js';

export const getWinners = (): UpdateWinnersResponse => {
  const winners: WinnersData[] = winnersModel.getWinners();

  const response = new UpdateWinnersResponse(winners);

  return response;
};
