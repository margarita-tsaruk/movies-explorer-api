const userRouters = require('express').Router();
const { validateUpdateUser } = require('../middlewares/validation');
const { getUser, updateUser } = require('../controllers/users');

userRouters.get('/users/me', getUser);
userRouters.patch('/users/me', validateUpdateUser, updateUser);

module.exports = userRouters;
