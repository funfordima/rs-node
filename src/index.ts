import 'dotenv/config';

import { createServer } from 'http';

import { handleServerError } from './helpers/handleServerError.js';
import { userRouter } from './routes/userRouter.js';

const PORT = process.env.PORT || 3000;

const server = createServer((req, res) => {
  try {
    userRouter(req, res);
  } catch (error) {
    handleServerError(res, error);
  }
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default server;
