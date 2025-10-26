import path from 'node:path';
import { fork } from 'node:child_process';

import { FILES } from '../constants/pathDirectory.js';
import { getFilePath } from '../helpers/getFilePath.js';

const spawnChildProcess = async (args) => {
  const fileName = 'script.js';
  const filePath = path.resolve(getFilePath(import.meta.url), FILES, fileName);

  fork(filePath, args);
};

spawnChildProcess(['someArgument1', 'someArgument2']);
