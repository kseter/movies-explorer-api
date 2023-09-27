const { celebrate, Joi, Segments } = require('celebrate');

const validateSignUp = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  }),
});

const validateSignIn = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  }),
});

const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
});

const validateCreateMovie = celebrate({
  [Segments.BODY]: Joi.object().keys({
    nameRU: Joi.string().min(2).max(30).required(),
    nameEN: Joi.string().min(2).max(30).required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(/^https?:\/\/(\w+[./])*(\w+:\d{0,5}\/)?/).required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    thumbnail: Joi.string().pattern(/^https?:\/\/(\w+[./])*(\w+:\d{0,5}\/)?/).required(),
    trailerLink: Joi.string().pattern(/^https?:\/\/(\w+[./])*(\w+:\d{0,5}\/)?/).required(),
    movieId: Joi.number().required(),
  }),
});

const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

const validateMovieId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    _id: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validateSignUp,
  validateSignIn,
  validateUpdateProfile,
  validateCreateMovie,
  validateUserId,
  validateMovieId,
};
