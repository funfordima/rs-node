import { promises } from 'fs';

import { BASE_ERROR } from '../constants/error.js';
import { checkFileExists } from './checkFileExists.js';

export const readDirectory = async () => {
  const sourcePath = process.cwd(); 
  const isSourceEntityExists = await checkFileExists(sourcePath);

  if (!isSourceEntityExists) {
    console.log(BASE_ERROR);
    
    return;
  }

  try {
    const files = await promises.readdir(sourcePath, { withFileTypes: true });
    
    const resultList = files.map((file) => {
      return {
        name: file.name,
        type: file.isDirectory() ? 'directory' : 'file',
      };
    });

    const dirList = resultList.filter(({ type }) => type === 'directory').sort();
    const fileList = resultList.filter(({ type }) => type === 'file').sort();

    console.table([...dirList, ...fileList]);
  } catch (error) {
    console.log(BASE_ERROR);
  }
};
