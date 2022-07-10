const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({ name, about, avatar, email, password: hash })
      .then(user => res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
       }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Invalid data' });
      } else if (err.name === 'ServerError') {
        res.status(500).send({ error: `'Internal Server Error: ${err}'` });
      }
    });
};

module.exports.getCurrentUser = (req, res) => {
  console.log('nash polsovatel', req.user._id);
  User.findById(req.user._id)
  .then((user) => res.send({
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    email: user.email,
    _id: user._id,
   }))
  .catch(err => console.log(err));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('No user found with that id');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'No user found with that id' });
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Invalid data' });
      } else if (err.name === 'ServerError') {
        res.status(500).send({ error: `'Internal Server Error: ${err}'` });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ error: `'Internal Server Error: ${err}'` }));
};

module.exports.updateProfile = (req, res) => {
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  User.updateOne(
    req.user._id,
    { runValidators: true },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('No user found with that id');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'No user found with that id' });
      } else if (err.name === 'ServerError') {
        res.status(500).send({ error: `'Internal Server Error: ${err}'` });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  User.updateOne(
    req.user._id,
    { runValidators: true },
    { new: true },
  )
    .orFail(() => {
      const error = new Error('No user found with that id');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'No user found with that id' });
      } else if (err.name === 'ServerError') {
        res.status(500).send({ error: `'Internal Server Error: ${err}'` });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
  .then((user) => {
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    res.send({ token })
  })
  .catch((err) => {
    res
    .status(401)
    .send({ message: err.message });
  });
};
