const Movie = require('../models/movie');
const ErrorBadReq = require('../errors/errorBadReq');
const ErrorReqNotFound = require('../errors/errorReqNotFound');
const ErrorForbiddenReq = require('../errors/errorForbiddenReq');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadReq('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new ErrorReqNotFound('Фильм с указанным _id не найден');
      }
      if (movie.owner.toString() !== userId) {
        throw new ErrorForbiddenReq('Нет прав на удаление фильма');
      } else {
        Movie.findByIdAndRemove(movieId)
          .then((removedMovie) => {
            res.send(removedMovie);
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadReq('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};
