const routes = require('express').Router();
const { auth } = require('../middlewares/auth');
const { validateSignUp, validateSignIn } = require('../middlewares/validation');

const {
  signup,
  signin,
  signout,
} = require('../controllers/users');

routes.post('/signup', validateSignUp, signup);

routes.post('/signin', validateSignIn, signin);

routes.delete('/signout', signout);

routes.use(auth);

routes.use(require('./users'));
routes.use('/', require('./movies'));
routes.use('*', require('./notCorrectPath'));

module.exports = routes;
