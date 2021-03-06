const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const ServerError = require('../errors/server-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Jacques Cousteau',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Explorer',
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/avatar_1604080799.jpg',
    validate: {
      validator: (v) => {
        /^(http|https):\/\/[^ "]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validator: (data) => {
      validator.isEmail(data);
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new ServerError(401, 'Authorization Required');
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new ServerError(401, 'Authorization Required');
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
