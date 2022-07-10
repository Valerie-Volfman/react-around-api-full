const express = require('express');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login, getCurrentUser } = require('./controllers/user');
const auth = require('./middleware/auth');
const mongoose = require('mongoose');
const helmet = require('helmet');

const app = express();
app.use(express.json());
app.use(helmet());
mongoose.connect('mongodb://localhost:27017/aroundb');

const { PORT = 3001 } = process.env;

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);
app.get('*', (req, res) => {
  res.status = 404;
  res.send({ message: 'Requested resource not found' });
});

app.listen(PORT);
