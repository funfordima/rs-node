import { IncomingMessage, ServerResponse } from 'http';

import userModel from 'models/userModel.js';
import { getUserId } from 'helpers/getUserId.js';
import { handleBadRequest } from 'helpers/handleBadRequest.js';
import { hasValidId } from 'helpers/hasValidId.js';
import { User } from 'models/user.js';
import { handleNotFoundRequest } from 'helpers/handleNotFoundRequest.js';
import { parseBody } from 'helpers/parseBody.js';

export const getUsers = (req: IncomingMessage, res: ServerResponse): void => {
  const users: User[] = userModel.findAll();

  res.writeHead(200, {
    'Content-type': 'application/json',
  });

  res.end(JSON.stringify(users));
};

export const getUser = (req: IncomingMessage, res: ServerResponse): void => {
  const userId: string = getUserId(req);

  if (!userId || !hasValidId(userId))
  {
    handleBadRequest(res);
    return;
  }

  const user: User | undefined = userModel.findById(userId);

  if (!user)
  {
    handleNotFoundRequest(res, userId);
    return;
  }

  res.writeHead(200, {
    'Content-type': 'application/json',
  });

  res.end(JSON.stringify(user));
};

export const createUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const { username, age, hobbies } = await parseBody(req);

  const hasValidUserNameType = typeof username === 'string';
  const hasValidAgeType = typeof age === 'number';
  const hasValidHobbies = Array.isArray(hobbies) && hobbies.every(h => typeof h === 'string');

  if (!username || !hasValidUserNameType || !hasValidAgeType || age < 0 || !hasValidHobbies)
  {
    handleBadRequest(res, 'Request body does not contain required fields.');
    return;
  }

  const user: User = userModel.createUser(username, age, hobbies);

  res.writeHead(201, {
    'Content-type': 'application/json',
  });

  res.end(JSON.stringify(user));
};

export const updateUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const userId: string = getUserId(req);

  if (!userId || !hasValidId(userId))
  {
    handleBadRequest(res);
    return;
  }

  const { username, age, hobbies } = await parseBody(req);

  const hasValidUserNameType = typeof username === 'string';
  const hasValidAgeType = typeof age === 'number';
  const hasValidHobbies = Array.isArray(hobbies) && hobbies.every(h => typeof h === 'string');

  if (!username || !hasValidUserNameType || !hasValidAgeType || age < 0 || !hasValidHobbies)
  {
    handleBadRequest(res, 'Request body does not contain required fields.');
    return;
  }

  const user: User | undefined = userModel.updateUser(userId, username, age, hobbies);

  if (!user) {
    handleNotFoundRequest(res, userId);
    return;
  }

  res.writeHead(200, {
    'Content-type': 'application/json',
  });

  res.end(JSON.stringify(user));
};

export const deleteUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  const userId: string = getUserId(req);

  if (!userId || !hasValidId(userId))
  {
    handleBadRequest(res);
    return;
  }

  const isDeleted = userModel.deleteUser(userId);

  if (!isDeleted) {
    handleNotFoundRequest(res, userId);
    return;
  }

  res.writeHead(204, {
    'Content-type': 'application/json',
  });

  res.end();
};

