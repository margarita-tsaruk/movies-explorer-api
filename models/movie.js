const mongoose = require('mongoose');
const { regularExpression } = require('../utils/utils');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле "страна" должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле "режиссер" должно быть заполнено'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле "длительность фильма" должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле "год фильма" должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле "описание фильма" должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле "ссылка на постер к фильму" должно быть заполнено'],
    validate: {
      validator(v) {
        return regularExpression.test(v);
      },
      message: 'Введите url',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Поле "ссылка на трейлер фильма" должно быть заполнено'],
    validate: {
      validator(v) {
        return regularExpression.test(v);
      },
      message: 'Введите url',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле "миниатюрное изображение постера к фильму" должно быть заполнено'],
    validate: {
      validator(v) {
        return regularExpression.test(v);
      },
      message: 'Введите url',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле "_id пользователя" должно быть заполнено'],
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'movie',
    required: [true, 'Поле "_id фильма" должно быть заполнено'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  nameEN: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
