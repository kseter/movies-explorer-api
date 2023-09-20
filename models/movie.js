const mongoose = require('mongoose');
const validator = require('validator');
const { validationMessage } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  nameRU: {
    type: String,
    required: [true, validationMessage.requared],
  },
  nameEN: {
    type: String,
    required: [true, validationMessage.requared],
  },
  description: {
    type: String,
    required: [true, validationMessage.requared],
  },
  image: {
    type: String,
    required: [true, validationMessage.requared],
    validate: {
      validator: (url) => validator.isURL(url),
      message: validationMessage.unvalidUrl,
    },
  },
  country: {
    type: String,
    required: [true, validationMessage.requared],
  },
  director: {
    type: String,
    required: [true, validationMessage.requared],
  },
  duration: {
    type: Number,
    required: [true, validationMessage.requared],
  },
  year: {
    type: String,
    required: [true, validationMessage.requared],
  },
  thumbnail: {
    type: String,
    required: [true, validationMessage.requared],
    validate: {
      validator: (url) => validator.isURL(url),
      message: validationMessage.unvalidUrl,
    },
  },
  trailerLink: {
    type: String,
    required: [true, validationMessage.requared],
    validate: {
      validator: (url) => validator.isURL(url),
      message: validationMessage.unvalidUrl,
    },
  },
  movieId: {
    type: Number,
    required: [true, validationMessage.requared],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
