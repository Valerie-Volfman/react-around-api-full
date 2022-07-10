const usersRouter = require('express').Router();

const {
  getUser, getUsers, updateProfile, updateAvatar, getCurrentUser,
} = require('../controllers/user');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/me', getCurrentUser);
usersRouter.get('/users/:id', getUser);
usersRouter.patch('/users/me', updateProfile);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;
