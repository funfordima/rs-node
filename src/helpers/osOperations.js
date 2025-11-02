import os from 'os';

import {
  EOL_VAR,
  CPU_VAR,
  HOMEDIR_VAR,
  USER_NAME_VAR,
  ARCHITECTURE_VAR,
} from '../constants/os.js';
import { BASE_ERROR } from '../constants/error.js';

export const osOperations = (operation) => {
  switch(true) {
    case (operation === EOL_VAR): {
      const output = os.EOL === '\n' ? '\\n' : '\\r\\n';

      console.log(output);

      break;
    }

    case (operation === CPU_VAR): {
      console.log('\namount CPUs: ', os.cpus().length, '\n');
      console.table(os.cpus().map(({ model, speed }) => ({ model, speed: `${speed / 1000}GHz` })));

      break;
    }

    case (operation === HOMEDIR_VAR): {
      console.log(os.homedir());

      break;
    }

    case (operation === USER_NAME_VAR): {
      console.log(os.userInfo().username);

      break;
    }

    case (operation === ARCHITECTURE_VAR): {
      console.log(os.arch());

      break;
    }

    default: {
      console.log(BASE_ERROR);
    }
  }
};
