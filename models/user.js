const mongoose = require('mongoose');
const validator = require('validator');
const { validationMessage } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, validationMessage.requared],
    minlength: [2, validationMessage.minlength],
    maxlength: [30, validationMessage.maxlength],
  },
  email: {
    type: String,
    required: [true, validationMessage.requared],
    unique: true,
    validate: {
      validator(email) {
        validator.isEmail(email);
      },
      message: validationMessage.email,
    },
  },
  password: {
    type: String,
    required: [true, validationMessage.requared],
    select: false,
  },

}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
