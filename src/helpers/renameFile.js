import path from 'path';
import { rename } from 'fs/promises';

import { BASE_ERROR, INVALID_INPUT } from '../constants/error.js';
import { checkFileExists } from './checkFileExists.js';
import { validatePath } from './validatePath.js';

export const renameFile = async (filePath, fileName) => {
  if (!filePath || !fileName) {
    console.log(INVALID_INPUT);
    
    return;
  }

  const sourcePath = path.resolve(validatePath([filePath]));
  const destinationPath = path.resolve(process.cwd(), fileName);
  const isSourceFileExists = await checkFileExists(sourcePath);

  if (!isSourceFileExists) {
    console.log(BASE_ERROR);

    return;
  }

  try {
    await rename(sourcePath, destinationPath);
  } catch {
    console.log(BASE_ERROR);
  }
};
