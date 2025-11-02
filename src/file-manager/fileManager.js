import path from 'path';

import { validatePath } from '../helpers/validatePath.js';
import { logDirectory } from '../helpers/logDirectory.js';
import { changeDirectory } from '../helpers/changeDirectory.js';
import { readDirectory } from '../helpers/readDirectory.js';
import { createDirectory } from '../helpers/createDirectory.js';
import { readFile } from '../helpers/readFile.js';
import { addFile } from '../helpers/addFile.js';
import { renameFile } from '../helpers/renameFile.js';
import { copyFile } from '../helpers/copyFile.js';
import { deleteFile } from '../helpers/deleteFile.js';
import { osOperations } from '../helpers/osOperations.js';
import { hashFile } from '../helpers/hashFile.js';
import { compressFile } from '../helpers/compressFile.js';
import { decompressFile } from '../helpers/decompressFile.js';

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

  async rn(filePath, fileName) {
    await renameFile(filePath, fileName);

    logDirectory();
  }

  async cp(filePath, dirPath) {
    await copyFile(filePath, dirPath);
    
    logDirectory();
  }

  async mv(filePath, dirPath) {
    await copyFile(filePath, dirPath);
    await deleteFile(filePath);

    logDirectory();
  }

   async rm(filePath) {
    await deleteFile(filePath);

    logDirectory();
  }

  os(operation) {
    osOperations(operation);

    logDirectory();
  }

  async hash(filePath) {
    await hashFile(filePath);

    logDirectory();
  }

  async compress(filePath, destinationPath) {
    await compressFile(filePath, destinationPath);

    logDirectory();
  }

  async decompress(filePath, destinationPath) {
    await decompressFile(filePath, destinationPath);

    logDirectory();
  }
}
