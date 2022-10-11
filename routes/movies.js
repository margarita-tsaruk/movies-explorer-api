const movieRouters = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

const { validateMovieId, validateMovie } = require('../middlewares/validation');

movieRouters.get('/movies', getMovies);

movieRouters.post('/movies', validateMovie, createMovie);

movieRouters.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = movieRouters;
