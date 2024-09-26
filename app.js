require('dotenv').config();

const express = require('express');
const auth = require('./routes/auth');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const { errorHandler } = require('./middleware/error');

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3003 });

wss.on('connection', (ws) => {
  console.log('Hello');
});

// wss.on('connection', (ws,) => {
//   console.log('Test');
// });

app.use(errorHandler);

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);

app.use('/api/v1/auth', auth);

const port = 3001;

app.listen(port, console.log(`Server is listening on port ${port}`));
