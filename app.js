const express = require('express');
const cors = require('cors');
const app = express();
const { errorHandler } = require('./middleware/error');

app.use(errorHandler);

app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000' }));

const port = 3001;

app.listen(port, console.log(`Server is listening on port ${port}`));
