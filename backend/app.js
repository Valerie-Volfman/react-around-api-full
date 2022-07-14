const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/aroundb');
app.use(express.json());
app.use(helmet());
app.use(errors());
app.use(cors());
app.options('*', cors());
app.use(requestLogger);

app.post('/signin', login);

app.post('/signup', createUser);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);
app.get('*', (req, res) => {
  res.status = 404;
  res.send({ message: 'Requested resource not found' });
});

app.use(errorLogger);
app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Invalid data' });
  }
  if (err.name === 'Unauthorized') {
    res.status(401).send({ message: 'Authorization Required' });
  }
  if (err.name === 'MongoServerError') {
    res
      .status(409)
      .send({
        message: 'Request is conflicting with an already existing registration',
      });
  }
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'An error occurred on the server' : message,
  });
});

app.listen(PORT);
