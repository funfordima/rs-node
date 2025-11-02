import path from 'path';
import { rm } from 'fs/promises';

import { BASE_ERROR } from '../constants/error.js';
import { validatePath } from './validatePath.js';

export const deleteFile = async (filePath) => {
  const sourcePath = path.resolve(validatePath([filePath]));

  try {
    await rm(sourcePath);
  } catch (error) {
    console.log(BASE_ERROR);
  }
};
