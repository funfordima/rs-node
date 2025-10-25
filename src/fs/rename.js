import path from 'path';
import { rename as renameFile } from 'fs/promises';

import { BASE_ERROR, FILES } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';
import { checkFileExists } from '../helpers/checkFileExists.js';

const rename = async () => {
  const sourceFileName = 'wrongFilename.txt';
  const targetFileName = 'properFilename.md';
  const sourceFilePath = path.resolve(getFilePath(import.meta.url), FILES, sourceFileName);
  const targetFilePath = path.resolve(getFilePath(import.meta.url), FILES, targetFileName);
  const isSourceFileExists = await checkFileExists(sourceFilePath);
  const isTargetFileExists = await checkFileExists(targetFilePath);

  if (!isSourceFileExists || isTargetFileExists) {
    throw Error(BASE_ERROR);
  }

  try {
    await renameFile(sourceFilePath, targetFilePath);
  } catch (error) {
    process.stderr.write(error);
  }
};

await rename();
