const Movie = require('../models/movie');
const ErrorBadReq = require('../errors/errorBadReq');
const ErrorReqNotFound = require('../errors/errorReqNotFound');
const ErrorForbiddenReq = require('../errors/errorForbiddenReq');

const {
  messageNoRights,
  messageIncorrectData,
  messageNonExistingId,
} = require('../errors/errorsMessages');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ ...req.body, owner })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadReq(messageIncorrectData));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;

  Movie.findOne({ movieId })
    .then((movie) => {
      if (!movie) {
        throw new ErrorReqNotFound(messageNonExistingId);
      }

      if (movie.owner.toString() !== userId) {
        throw new ErrorForbiddenReq(messageNoRights);
      } else {
        Movie.findOneAndRemove({ movieId })
          .then((removedCard) => {
            res.send(removedCard);
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadReq(messageIncorrectData));
      } else {
        next(err);
      }
    });
};
