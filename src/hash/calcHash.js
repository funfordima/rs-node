import path from 'path';
import { createReadStream } from 'fs';
import { createHash } from 'crypto';

import { BASE_ERROR, FILES } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';
import { checkFileExists } from '../helpers/checkFileExists.js';

const calculateHash = async () => {
  const fileName = 'fileToCalculateHashFor.txt';
  const filePath = path.resolve(getFilePath(import.meta.url), FILES, fileName);
  const isFileExists = await checkFileExists(filePath);
  
  if (!isFileExists) {
    throw Error(BASE_ERROR);
  }

  const hash = createHash('sha256');

  const input = createReadStream(filePath);
  input.pipe(hash).setEncoding('hex').pipe(process.stdout);

  hash.on('finish', () => {
    process.stdout.write('\n');
  });

  hash.on('error', (err) => {
    process.stderr.write(err);
  });
};

await calculateHash();
