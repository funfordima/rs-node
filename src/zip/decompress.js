import path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGunzip } from 'zlib';

import { BASE_ERROR, FILES } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';
import { checkFileExists } from '../helpers/checkFileExists.js';

const decompress = async () => {
  const sourceFileName = 'archive.gz';
  const targetFileName = 'fileToCompress.txt';
  const sourceFilePath = path.resolve(getFilePath(import.meta.url), FILES, sourceFileName);
  const targetFilePath = path.resolve(getFilePath(import.meta.url), FILES, targetFileName);
  const isSourceFileExists = await checkFileExists(sourceFilePath);

  if (!isSourceFileExists) {
    throw Error(BASE_ERROR);
  }

  const input = createReadStream(sourceFilePath);
  const output = createWriteStream(targetFilePath, { encoding: 'utf-8'});
  const gunzip = createGunzip();

  try {
    await pipeline(
      input,
      gunzip,
      output
    );
  } catch (error) {
    console.error(error);
  }
};

await decompress();
