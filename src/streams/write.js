import path from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

import { BASE_ERROR, FILES } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';
import { checkFileExists } from '../helpers/checkFileExists.js';

const write = async () => {
  const fileName = 'fileToWrite.txt';
    const filePath = path.resolve(getFilePath(import.meta.url), FILES, fileName);
    const isFileExists = await checkFileExists(filePath);
    
    if (!isFileExists) {
      throw Error(BASE_ERROR);
    }
    
    const output = createWriteStream(filePath, { encoding: 'utf-8'});
  
    try {
      await pipeline(
        process.stdin, 
        output
      );
  
    } catch (error) {
      console.log(error);
    }
};

await write();
