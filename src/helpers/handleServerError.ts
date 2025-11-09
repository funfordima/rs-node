import { ServerResponse } from 'http';

export const handleServerError = (res: ServerResponse, err: unknown): void => {
  res.writeHead(500, {
    'Content-type': 'application/json',
  });

  res.end(
    JSON.stringify({
      message: `An internal server error occurred: ${err}`,
    }),
  );
};
