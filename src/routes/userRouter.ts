import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';

import { routerPrefix } from '../constants/routerPrefix.js';
import { methodsEnum } from '../constants/methods.js';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from 'controllers/userController.js';

export const userRouter = (req: IncomingMessage, res: ServerResponse) => {
  const { pathname } = parse(req.url || '', true);
  const method = req.method;

  switch (true) {
    case pathname == routerPrefix && method == methodsEnum.GET: {
      getUsers(req, res);
      return;
    }

    case pathname?.startsWith(routerPrefix) && method == methodsEnum.GET: {
      getUser(req, res);
      return;
    }

    case pathname == routerPrefix && method == methodsEnum.POST: {
      createUser(req, res);
      return;
    }

    case pathname?.startsWith(routerPrefix) && method == methodsEnum.PUT: {
      updateUser(req, res);
      return;
    }

    case pathname?.startsWith(routerPrefix) && method == methodsEnum.DELETE: {
      deleteUser(req, res);
      return;
    }

    default: {
      res.writeHead(404, {
        'Content-type': 'application/json',
      });

      res.end(
        JSON.stringify({
          message: 'Not Found',
        }),
      );
      return;
    }
  }
};
