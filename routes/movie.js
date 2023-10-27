const router = require('express').Router();
const { createMovie, getMovies, deleteMovie } = require('../controllers/movie');
const { validateMovieId } = require('../utils/validation');

router.get('/movies', getMovies);
router.post('/movies', createMovie); // create a movie card
router.delete('/movies/:_id', validateMovieId, deleteMovie); // delete a movie card by ID

module.exports = router;
