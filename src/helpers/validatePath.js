import path from 'path';

export const validatePath = (pathList) => {
  const targetPath = path.resolve(...pathList);

  if (path.isAbsolute(targetPath)) {
    return targetPath;
  }

  return path.resolve(process.cwd(), targetPath);
};
