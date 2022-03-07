const passport = require('passport');
const {
  getSignUpPage,
  postSignUp,
  postSignOut,
  getSignInPage,
  postSignIn,
} = require('../controllers/authController');
const {
  passportLocalStrategy,
  validateJoiUserSignUp,
  validateJoiUserSignIn,
} = require('../middleware/auth');
const { isLoggedInRedirectAway } = require('../middleware/auth');

passport.use('local', passportLocalStrategy);

const router = require('express').Router();

router.get('/auth/sign-up', isLoggedInRedirectAway, getSignUpPage);

router.post('/auth/sign-up', validateJoiUserSignUp, postSignUp);

router.post('/auth/sign-out', postSignOut);

router.get('/auth/sign-in', isLoggedInRedirectAway, getSignInPage);

router.post(
  '/auth/sign-in',
  validateJoiUserSignIn,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/auth/sign-in',
  }),
  postSignIn
);

module.exports = router;
