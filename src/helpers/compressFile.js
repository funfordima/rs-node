import path from 'path';
import { createGzip } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';

import { BASE_ERROR, INVALID_INPUT } from '../constants/error.js';
import { checkFileExists } from './checkFileExists.js';
import { checkDirExists } from './checkDirExists.js';
import { validatePath } from './validatePath.js';

export const compressFile = async (filePath, destPath) => {
  if (!filePath || !destPath) {
    console.log(INVALID_INPUT);
    return;
  }

  const sourcePath = path.resolve(validatePath([filePath]));
  const destinationPath = path.resolve(validatePath([destPath]));
  const isSourceFileExists = await checkFileExists(sourcePath);
  const isDestinationPathInValid = await checkDirExists(destinationPath);

  console.log(sourcePath, destinationPath, isDestinationPathInValid);

  if (!isSourceFileExists || isDestinationPathInValid) {
    console.log(BASE_ERROR);
    return;
  }

  await new Promise((res, rej) => {
    const gzip = createGzip();
    const sourceStream = createReadStream(sourcePath);
    const destinationStream = createWriteStream(destinationPath);
    const compressStream = sourceStream.pipe(gzip).pipe(destinationStream);

    console.log('Compressed file has been created.');

    compressStream.on('data', (chunk) => {
      console.log(chunk);
    });

    compressStream.on('end', () => {
      process.stdout.setEncoding('utf8');
      res();
    });

    compressStream.on('error', () => {
      rej(`${BASE_ERROR}\r\n`);
    });
  });
};
