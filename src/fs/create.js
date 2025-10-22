
import path from 'path';
import { writeFile } from 'fs/promises';

import { FILES } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';
import { checkFileExists } from '../helpers/checkFileExists.js';

const create = async () => {
  const fileName = 'fresh.txt';
  const filePath = path.resolve(getFilePath(import.meta.url), FILES, fileName);
  const isFileExists = await checkFileExists(filePath);

  if (isFileExists) {
    throw Error('FS operation failed');
  }

  try {
    await writeFile(filePath, 'I am fresh and young \n', 'utf8');
  } catch (error) {
    process.stderr.write(error);
  }
};

await create();
