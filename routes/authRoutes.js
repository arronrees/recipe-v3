const {
  getSignUpPage,
  postSignUp,
  postSignOut,
} = require('../controllers/authController');

const router = require('express').Router();

router.get('/auth/sign-up', getSignUpPage);

router.post('/auth/sign-up', postSignUp);

router.post('/auth/sign-out', postSignOut);

module.exports = router;
