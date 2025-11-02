import { stat } from 'fs/promises';

export const checkDirExists = async (dirPath) => {
  try {
    const stats = await stat(dirPath);

    return stats.isDirectory();
  } catch (error) {
    return false;
  }
};
