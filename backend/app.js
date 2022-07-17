const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/user');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const ErrorHandler = require('./middlewares/error-handler');
const ServerError = require('./errors/server-err');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/aroundb');
app.use(express.json());
app.use(helmet());
app.use(errors());
app.use(cors());
app.options('*', cors());
app.use(requestLogger);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.post('/signin', login);

app.post('/signup', createUser);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);
app.get('*', () => {
  throw new ServerError(404, 'Requested resource not found');
});

app.use(errorLogger);
app.use((err, req, res, next) => {
  ErrorHandler(err, res);
});

app.listen(PORT);
