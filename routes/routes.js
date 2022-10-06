const routes = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  signup,
  signin,
  signout,
} = require('../controllers/users');

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signup);

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), signin);

routes.delete('/signout', signout);

module.exports = routes;
