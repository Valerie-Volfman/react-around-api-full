const usersRouter = require('express').Router();
const validator = require('validator');
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/user');

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getCurrentUser);
usersRouter.get(
  '/users/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().hex().length(24),
    }),
  }),
  getUser,
);
usersRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);
usersRouter.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().custom(validateURL),
    }),
  }),
  updateAvatar,
);

module.exports = usersRouter;
