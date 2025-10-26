import path from 'path';
import { readFile } from 'fs/promises';

import { BASE_ERROR, FILES } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';
import { checkFileExists } from '../helpers/checkFileExists.js';

const read = async () => {
  const fileName = 'fileToRead.txt';
  const filePath = path.resolve(getFilePath(import.meta.url), FILES, fileName);
  const isFileExists = await checkFileExists(filePath);

  if (!isFileExists) {
    throw Error(BASE_ERROR);
  }

  try {
    const fileContent = await readFile(filePath, { encoding: 'utf8' });

    console.log(fileContent);
  } catch (error) {
    process.stderr.write(error);
  }
};

await read();
