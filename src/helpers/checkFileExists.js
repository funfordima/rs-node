import { access, constants } from 'fs/promises';

export const checkFileExists = async (filePath) => {
  try {
    await access(filePath, constants.R_OK);

    return true;
  } catch {
    return false;
  }
};
