const jwt = require('jsonwebtoken');
const AuthError = require('../errors/authError');
const { messageAuth } = require('../errors/errorsMessages');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthError(messageAuth);
  }

  req.user = payload;
  return next();
};
