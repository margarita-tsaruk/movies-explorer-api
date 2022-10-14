const notCorrectPath = require('express').Router();
const ErrorReqNotFound = require('../errors/errorReqNotFound');
const { messageNonExistingAddress } = require('../errors/errorsMessages');

notCorrectPath.all('*', () => {
  throw new ErrorReqNotFound(messageNonExistingAddress);
});

module.exports = notCorrectPath;
