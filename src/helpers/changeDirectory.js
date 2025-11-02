import { BASE_ERROR } from '../constants/error.js';

export const changeDirectory = (dirPath) => {
  try {
    process.chdir(dirPath);
  } catch (error) {
    console.log(BASE_ERROR);
  }
};
