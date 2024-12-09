require('dotenv').config();
require('./websockets');

const express = require('express');
const auth = require('./routes/auth');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

const { errorHandler } = require('./middleware/error');

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
