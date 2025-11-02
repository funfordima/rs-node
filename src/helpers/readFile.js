import { createReadStream } from 'fs';

import { BASE_ERROR, INVALID_INPUT } from '../constants/error.js';
import { validatePath } from './validatePath.js';
import { checkFileExists } from './checkFileExists.js';

export const readFile = async (pathToFile) => {
  if (!pathToFile) {
    console.log(INVALID_INPUT);
    
    return;
  }

	const sourcePath = validatePath(pathToFile);
  const isSourceFileExists = await checkFileExists(sourcePath);

  if (!isSourceFileExists) {
    console.log(BASE_ERROR);
    return;
  }

  await new Promise((res, rej) => {
    const sourceStream = createReadStream(sourcePath, { encoding: 'utf8' });

    console.log('File content:');

    sourceStream.on('data', (chunk) => {
      console.log(chunk);
    });

    sourceStream.on('end', () => {
      process.stdout.setEncoding('utf8');
      res();
    });

    sourceStream.on('error', () => {
      rej(`${BASE_ERROR}\r\n`);
    });
  });
};
