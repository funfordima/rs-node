import path from 'path';
import { readdir } from 'fs/promises';

import { BASE_ERROR, FILES } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';
import { checkDirExists } from '../helpers/checkDirExists.js';

const list = async () => {
  const filesPath = path.resolve(getFilePath(import.meta.url), FILES);

  const isFilesDirExists = await checkDirExists(filesPath);

  if (!isFilesDirExists) {
    throw Error(BASE_ERROR);
  }

  try {
    const files = await readdir(filesPath);

    process.stdout.write('[ \n');

		for (const file of files) {
			process.stdout.write(`  ${file}, \n`);
		}
		
		process.stdout.write('] \n');
  } catch (error) {
    process.stderr.write(error);
  }
};

await list();
