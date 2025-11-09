import { ServerResponse } from 'http';

export const handleNotFoundRequest = (res: ServerResponse, id: string): void => {
  res.writeHead(404, {
    'Content-type': 'application/json',
  });

  res.end(
    JSON.stringify({
      message: `User with id: ${id} doesn't exist`,
    }),
  );
};
