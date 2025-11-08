import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';

import { routerPrefix } from '../constants/routerPrefix.js';
import { methodsEnum } from '../constants/methods.js';
import { getUsers } from 'controllers/userController.js';

export const userRouter = (req: IncomingMessage, res: ServerResponse) => {
  const { pathname } = parse(req.url || "", true);
  const method = req.method;

  switch(true)
  {
    case pathname == routerPrefix && method == methodsEnum.GET: {
      getUsers(req, res);
      
      break;
    }

    default: {
      res.writeHead(404, {
        'Content-type': 'application/json',
      });

      res.end(JSON.stringify({
        message: 'Not Found',
      }));
    }
  }
};
