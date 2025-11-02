import path from 'path';
import { rename } from 'fs/promises';

import { checkFileExists } from './checkFileExists.js';
import { validatePath } from './validatePath.js';
import { BASE_ERROR } from '../constants/error.js';

export const renameFile = async (filePath, fileName) => {
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
