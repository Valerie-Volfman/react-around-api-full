const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors, celebrate, Joi } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const app = express();
app.use(express.json());
app.use(helmet());
mongoose.connect('mongodb://localhost:27017/aroundb');

const { PORT = 3001 } = process.env;

app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(4).max(30)
        .email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(4).max(30)
        .email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser,
);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);
app.get('*', (req, res) => {
  res.status = 404;
  res.send({ message: 'Requested resource not found' });
});

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Invalid data' });
  }
  if (err.name === 'Unauthorized') {
    res.status(401).send({ message: 'Authorization Required' });
  }
  if (err.name === 'MongoServerError') {
    res.status(409).send({ message: 'Request is conflicting with an already existing registration' });
  }
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
});

app.listen(PORT);
