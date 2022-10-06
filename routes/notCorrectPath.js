const notCorrectPath = require('express').Router();
const ErrorReqNotFound = require('../errors/errorReqNotFound');

notCorrectPath.all('*', () => {
  throw new ErrorReqNotFound('Запрашиваемого ресурса не существует');
});

module.exports = notCorrectPath;
