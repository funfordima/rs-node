import path from 'path';
import { cp } from 'fs/promises';

import { BASE_ERROR, FILES, FILES_COPY } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';
import { checkDirExists } from '../helpers/checkDirExists.js';

const copy = async () => {
  const filesPath = path.resolve(getFilePath(import.meta.url), FILES);
  const filesCopyPath = path.resolve(getFilePath(import.meta.url), FILES_COPY);

  const isFilesDirExists = await checkDirExists(filesPath);
  const isFilesCopyDirExists = await checkDirExists(filesCopyPath);

  if (!isFilesDirExists || isFilesCopyDirExists) {
    throw Error(BASE_ERROR);
  }

  try {
    await cp(filesPath, filesCopyPath, { recursive: true });
  } catch (error) {
    process.stderr.write(error);
  }
};

await copy();
