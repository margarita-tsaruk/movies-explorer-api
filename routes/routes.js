const routes = require('express').Router();
const { validateSignUp, validateSignIn } = require('../middlewares/validation');

const {
  signup,
  signin,
  signout,
} = require('../controllers/users');

routes.post('/signup', validateSignUp, signup);

routes.post('/signin', validateSignIn, signin);

routes.delete('/signout', signout);

module.exports = routes;
