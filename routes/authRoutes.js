const {
  getSignUpPage,
  postSignUp,
  postSignOut,
  getSignInPage,
  postSignIn,
} = require('../controllers/authController');

const router = require('express').Router();

router.get('/auth/sign-up', getSignUpPage);

router.post('/auth/sign-up', postSignUp);

router.post('/auth/sign-out', postSignOut);

router.get('/auth/sign-in', getSignInPage);

router.post('/auth/sign-in', postSignIn);

module.exports = router;
