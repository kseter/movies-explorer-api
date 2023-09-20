const router = require('express').Router();
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const movieRouter = require('./movie');
const NotFoundError = require('../errors/not-found-error');
const { createUser, login } = require('../controllers/user');
const { validateSignUp, validateSignIn } = require('../utils/validation');

router.post('/signup', validateSignUp, createUser);
router.post('/signin', validateSignIn, login);
router.use(auth);
router.use(usersRouter);
router.use(movieRouter);

router.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
