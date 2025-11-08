import { IncomingMessage, ServerResponse } from 'http';

import { handleServerError } from '../helpers/handleServerError.js';
import userModel from 'models/userModel.js';

export const getUsers = (req: IncomingMessage, res: ServerResponse) => {
  try {
    const users = userModel.findAll();

    res.writeHead(200, {
      'Content-type': 'application/json',
    });

    res.end(JSON.stringify(users));
  } catch (error) {
    handleServerError(res, error);
  }
};
