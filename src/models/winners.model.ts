import { WinnersData } from '../types/wss.type.js';

const winners: WinnersData[] = [];

export const winnersModel = {
  getWinners(): WinnersData[] {
    return winners;
  },

  addWinner: (name: string): WinnersData | null => {
    if (name.startsWith('Bot')) {
      return null;
    }

    const winner = winners.find(w => w.name === name);
    
    if (winner) {
      winner.wins++;

      return winner;
    } else {
      const newWinner = {
        name,
        wins: 1,
      };

      winners.push(newWinner);

      return newWinner;
    }
  },
};
