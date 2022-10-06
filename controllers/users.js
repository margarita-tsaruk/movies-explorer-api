const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const ErrorReqNotFound = require('../errors/errorReqNotFound');
const ErrorBadReq = require('../errors/errorBadReq');
const ErrorExistingUser = require('../errors/errorExistingUser');
const AuthError = require('../errors/authError');

const signup = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      name, email, password: hashedPassword,
    }))
    .then((newUser) => res.send(newUser))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ErrorExistingUser('Пользователь с таким email уже существует'));
      } else if (err.name === 'ValidationError') {
        next(new ErrorBadReq('Переданы некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

const signin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильный пароль или email');
      }
      bcrypt.compare(password, user.password)
        .then((isUserValid) => {
          if (isUserValid) {
            const token = jwt.sign({
              _id: user._id,
            }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');

            res.cookie('jwt', token, {
              expiresIn: '7d',
              httpOnly: true,
              sameSite: false,
            });

            res.send({ data: user.toJSON() });
          } else {
            throw new AuthError('Неправильные почта или пароль');
          }
        })
        .catch(next);
    })
    .catch(next);
};

function signout(req, res, next) {
  try {
    if (!req.cookies) {
      next(new ErrorReqNotFound('Пользователь с указанным _id не найден'));
      return;
    }
    res.clearCookie('jwt').send({ message: 'Ok' }).end();
  } catch (err) {
    next(err);
  }
}

const getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new ErrorReqNotFound('Пользователь с указанным _id не найден'));
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(id, { email, name }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadReq('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  signup,
  signin,
  signout,
  getUser,
  updateUser,
};
