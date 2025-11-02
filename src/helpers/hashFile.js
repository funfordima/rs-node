import path from 'path';
import { createHash } from 'crypto';
import { createReadStream } from 'fs';

import { BASE_ERROR } from '../constants/error.js';
import { checkFileExists } from './checkFileExists.js';
import { validatePath } from './validatePath.js';

export const hashFile = async (filePath) => {
  const sourcePath = path.resolve(validatePath([filePath]));
  const hash = createHash('sha256').setEncoding('hex');
  const isSourceFileExists = await checkFileExists(sourcePath);

  if (!isSourceFileExists) {
    console.log(BASE_ERROR);
    
    return;
  }

  await new Promise((res, rej) => {
    const sourceStream = createReadStream(sourcePath, { encoding: 'utf8' });
    const hashStream = sourceStream.pipe(hash);

    console.log('Hash stream:');

    hashStream.on('data', (chunk) => {
      console.log(chunk);
    });

    hashStream.on('end', () => {
      process.stdout.setEncoding('utf8');
      res();
    });

    hashStream.on('error', () => {
      rej(`${BASE_ERROR}\r\n`);
    });
  });
};
