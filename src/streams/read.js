import path from 'path';
import { createReadStream } from 'fs';
import { Writable } from 'stream';
import { pipeline } from 'stream/promises';

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
  
  const input = createReadStream(filePath, { encoding: 'utf-8'});

  const stdoutWrapper = new Writable({
    write(chunk, encoding, callback) {
      process.stdout.write(chunk, encoding, () => setImmediate(callback));
    }
  });

  try {
    await pipeline(
      input, 
      stdoutWrapper
    );

    process.stdout.write('\n');
  } catch (error) {
    console.log(error);
  }
};

await read();
