const { default: mongoose } = require('mongoose');
const Movie = require('../models/movie');
const { OK_STATUS, CREATED_STATUS } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const NoRightsError = require('../errors/no-rights-error');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(OK_STATUS).send(movies);
    })
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => { // post route /movie
  console.log(req.user._id);
  const {
    country, director, duration,
    year, description, image, trailerLink,
    nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    nameRU,
    nameEN,
    description,
    image,
    country,
    director,
    duration,
    year,
    thumbnail,
    trailerLink,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(CREATED_STATUS).send(movie);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
        return;
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => { // delete route /movie/_id
  const { _id } = req.params;
  Movie.findById(_id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с таким ID не найден');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new NoRightsError('Нет прав для удаления фильма');
      }
      Movie.deleteOne(movie)
        .then((removedMovie) => {
          res.send({ message: 'Фильм удален', movie: removedMovie });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Неверный ID'));
        return;
      }
      next(err);
    });
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};
