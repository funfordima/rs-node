import 'dotenv/config';
import { createServer } from 'http';

import { userRouter } from 'routes/userRouter.js';

const PORT = process.env.PORT || 3000;

const server = createServer((req, res) => {
  try {
    userRouter(req, res);
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'An internal server error occurred' }));
  }
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default server;
