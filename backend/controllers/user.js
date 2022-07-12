const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const FoundError = require('../errors/found-err');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
          _id: user._id,
        }));
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new FoundError(404, 'No user found with that id');
      }
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new FoundError(404, 'No user found with that id');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  User.updateOne(
    req.user._id,
    { runValidators: true },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        throw new FoundError(404, 'No user found with that id');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  User.updateOne(
    req.user._id,
    { runValidators: true },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        throw new FoundError(404, 'No user found with that id');
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
