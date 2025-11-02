import path from 'path';
import { createReadStream, createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

import { BASE_ERROR, INVALID_INPUT } from '../constants/error.js';
import { checkFileExists } from './checkFileExists.js';
import { validatePath } from './validatePath.js';

export const copyFile = async (filePath, dirPath) => {
  if (!filePath || !dirPath) {
    console.log(INVALID_INPUT);
    
    return;
  }

  const sourcePath = path.resolve(validatePath([filePath])); 
  const destinationPath = path.resolve(validatePath([dirPath, path.parse(sourcePath).base]));  
  const isSourceFileExists = await checkFileExists(sourcePath);

  if (!isSourceFileExists) {
    console.log(BASE_ERROR);
    
    return;
  }

  try {
    const readable = createReadStream(sourcePath);
    const writable = createWriteStream(destinationPath, { flags: 'w' });

    await pipeline(readable, writable);
  } catch (err) {
    console.log(BASE_ERROR);
  } 
};
