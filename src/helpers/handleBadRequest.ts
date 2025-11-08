import { ServerResponse } from 'http';

export const handleBadRequest = (res: ServerResponse, message: string = 'Bad request'): void => {
  res.writeHead(400, {
    'Content-type': 'application/json',
  });

  res.end(JSON.stringify({
    message,
  }));
};
