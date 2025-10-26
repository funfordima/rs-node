
import path from 'path';
import { writeFile } from 'fs/promises';

import { BASE_ERROR, FILES } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';
import { checkFileExists } from '../helpers/checkFileExists.js';

const create = async () => {
  const fileName = 'fresh.txt';
  const filePath = path.resolve(getFilePath(import.meta.url), FILES, fileName);
  const isFileExists = await checkFileExists(filePath);

  if (isFileExists) {
    throw Error(BASE_ERROR);
  }

  try {
    await writeFile(filePath, 'I am fresh and young \n', 'utf8');
  } catch (error) {
    process.stderr.write(error);
  }
};

await create();
