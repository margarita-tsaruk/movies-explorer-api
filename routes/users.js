const userRouters = require('express').Router();
const { getUser, updateUser } = require('../controllers/users');

userRouters.get('/users/me', getUser);
userRouters.patch('users/me', updateUser);

module.exports = userRouters;
