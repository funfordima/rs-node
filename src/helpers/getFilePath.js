import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const getFilePath = (url) => dirname(fileURLToPath(url));
