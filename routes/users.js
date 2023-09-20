const router = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/user');
const { validateUpdateProfile } = require('../utils/validation');

router.get('/users/me', getUserInfo); // return user info (name, email)
router.patch('/users/me', validateUpdateProfile, updateUserInfo); // update user info

module.exports = router;
