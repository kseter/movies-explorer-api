const { default: mongoose } = require('mongoose');

const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { OK_STATUS, CREATED_STATUS } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AuthError = require('../errors/auth-error');
const ConflictError = require('../errors/conflict-error');

const getUserInfo = (req, res, next) => { // get route /user/me
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new NotFoundError('Пользователь не найден'));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => { // post route /sign-up
  const { name, email, password } = req.body;
  if (!email || !password) {
    throw new AuthError('Неправильные почта или пароль');
  }

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    })
      .then((user) => {
        res.status(CREATED_STATUS).send({
          name: user.name,
          _id: user._id,
          email: user.email,
        });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Пользователь с такие email уже зарегистрирован'));
        } else if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          return;
        }
        next(err);
      }));
};

const updateUserInfo = (req, res, next) => { // patch route /user/me
  const userId = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(OK_STATUS).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Некорректно введены данные'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => { // post route /sigh-in
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new AuthError('Неправильный логин или пароль');
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production'
          ? JWT_SECRET
          : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  login,
  createUser,
};
