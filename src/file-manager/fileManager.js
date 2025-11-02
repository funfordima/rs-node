import path from 'path';

import { validatePath } from '../helpers/validatePath.js';
import { logDirectory } from '../helpers/logDirectory.js';
import { changeDirectory } from '../helpers/changeDirectory.js';
import { readDirectory } from '../helpers/readDirectory.js';
import { createDirectory } from '../helpers/createDirectory.js';
import { readFile } from '../helpers/readFile.js';
import { addFile } from '../helpers/addFile.js';

export class FileManager {
  constructor() {
    if (!FileManager.instance) {
      FileManager.instance = this;
    }

    return FileManager.instance;
  }

   up() {
    const currentDirectory = process.cwd();
    const rootDir = path.parse(currentDirectory).root;

    if (currentDirectory === rootDir) {
      logDirectory();

      return;
    }

    const newPath = path.join(currentDirectory, '..');

    changeDirectory(newPath);
    logDirectory();
  }

  cd(...args) {
    const targetPath = validatePath(args);
    const currentDirectory = process.cwd();
    const rootDir = path.parse(currentDirectory).root;
    const targetRootDir = path.parse(targetPath).root;

    if (targetRootDir !== rootDir) {
      logDirectory();

      return;
    }

    changeDirectory(targetPath);
    logDirectory();
  }

  async ls() {
    await readDirectory();

    logDirectory();
  }

  async cat(...pathToFile) {
    await readFile(pathToFile);

    logDirectory();
  }

  async add(fileName) {
    await addFile(fileName);

    logDirectory();
  }

  async mkdir(dirName) {
    await createDirectory(dirName);

    logDirectory();
  }
}
