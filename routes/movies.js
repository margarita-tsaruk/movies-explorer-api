const movieRouters = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

movieRouters.get('/movies', getMovies);
movieRouters.post('/movies', createMovie);
movieRouters.delete('/movies/:id', deleteMovie);

module.exports = movieRouters;
