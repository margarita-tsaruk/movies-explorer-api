const rateLimit = require('express-rate-limit');
const ErrorRequestLimiter = require('../errors/errorRequestLimiter');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  handler: (req, res, next) => next(new ErrorRequestLimiter('Колличество запросов с текущего IP превышено')),
});

module.exports = limiter;
