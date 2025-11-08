import { IncomingMessage } from 'http';

import { User } from 'models/user.js';

export const parseBody = async (req: IncomingMessage): Promise<User> => {
  let body = '';

  for await (const chunk of req) {
    body += chunk;
  }

  return JSON.parse(body);
};
