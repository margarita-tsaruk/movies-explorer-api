const rateLimit = require('express-rate-limit');
const ConflictError = require('../errors/conflictError');
const { messageLimiter } = require('../errors/errorsMessages');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res, next) => next(new ConflictError(messageLimiter)),
});

module.exports = limiter;
