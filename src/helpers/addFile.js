import path from 'path';
import { promises } from 'fs';

import { BASE_ERROR, INVALID_INPUT } from '../constants/error.js';

export const addFile = async (fileName) => {
  if (!fileName) {
    console.log(INVALID_INPUT);
    
    return;
  }

	const sourcePath = path.resolve(process.cwd(), fileName);

	try {
		await promises.writeFile(sourcePath, '', { flag: 'w+' });
	} catch (error) {
		console.log(BASE_ERROR);
	}
};
