import { BASE_ERROR, INVALID_INPUT } from '../constants/error.js';

export const changeDirectory = (dirPath) => {
  if (!dirPath) {
    console.log(INVALID_INPUT);
    
    return;
  }

  try {
    process.chdir(dirPath);
  } catch (error) {
    console.log(BASE_ERROR);
  }
};
