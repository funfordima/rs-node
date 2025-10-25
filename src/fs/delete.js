import path from 'path';
import { rm } from 'fs/promises';

import { BASE_ERROR, FILES } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';
import { checkFileExists } from '../helpers/checkFileExists.js';

const remove = async () => {
  const fileName = 'fileToRemove.txt';
  const filePath = path.resolve(getFilePath(import.meta.url), FILES, fileName);
  const isFileExists = await checkFileExists(filePath);

  if (!isFileExists) {
    throw Error(BASE_ERROR);
  }

  try {
    await rm(filePath);
  } catch (error) {
    process.stderr.write(error);
  }
};

await remove();
