import path from 'path';
import { mkdir } from 'fs/promises';

import { BASE_ERROR } from '../constants/error.js';

export const createDirectory = async (dirName) => {
  const sourcePath = path.resolve(process.cwd(), dirName);

  try {
    await mkdir(sourcePath, { recursive: true });
  } catch {
    console.log(BASE_ERROR);
  }
};
