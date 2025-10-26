import path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';

import { BASE_ERROR, FILES } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';
import { checkFileExists } from '../helpers/checkFileExists.js';

const compress = async () => {
  const sourceFileName = 'fileToCompress.txt';
  const targetFileName = 'archive.gz';
  const sourceFilePath = path.resolve(getFilePath(import.meta.url), FILES, sourceFileName);
  const targetFilePath = path.resolve(getFilePath(import.meta.url), FILES, targetFileName);
  const isSourceFileExists = await checkFileExists(sourceFilePath);

  if (!isSourceFileExists) {
    throw Error(BASE_ERROR);
  }

  const input = createReadStream(sourceFilePath, { encoding: 'utf-8'});
  const output = createWriteStream(targetFilePath);
  const gzip = createGzip();

  try {
    await pipeline(
      input,
      gzip,
      output
    );
  } catch (error) {
    process.stderr.write(error);
  }
};

await compress();
