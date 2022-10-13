const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const ErrorReqNotFound = require('../errors/errorReqNotFound');
const ErrorBadReq = require('../errors/errorBadReq');
const ErrorExistingUser = require('../errors/errorExistingUser');
const AuthError = require('../errors/authError');
const {
  messageExistingEmail,
  messageIncorrectData,
  messageWrongAuth,
  messageNonExistingId,
} = require('../errors/errorsMessages');
const { replyAuthSuccess, replySignoutSuccess } = require('../utils/replyMessages');

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
        next(new ErrorExistingUser(messageExistingEmail));
      } else if (err.name === 'ValidationError') {
        next(new ErrorBadReq(messageIncorrectData));
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
        throw new AuthError(messageWrongAuth);
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

            res.send({ data: user.toJSON(), message: replyAuthSuccess });
          } else {
            throw new AuthError(messageWrongAuth);
          }
        })
        .catch(next);
    })
    .catch(next);
};

function signout(req, res, next) {
  try {
    if (!req.cookies) {
      next(new ErrorReqNotFound(messageIncorrectData));
      return;
    }
    res.clearCookie('jwt').send({ message: replySignoutSuccess }).end();
  } catch (err) {
    next(err);
  }
}

const getUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new ErrorReqNotFound(messageNonExistingId));
      } else {
        res.send(user);
      }
    })
    .catch(next);
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
      if (err.code === 11000) {
        next(new ErrorExistingUser(messageExistingEmail));
      } else if (err.name === 'ValidationError') {
        next(new ErrorBadReq(messageIncorrectData));
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
