const {
  getSignUpPage,
  postSignUp,
  postSignOut,
  getSignInPage,
  postSignIn,
} = require('../controllers/authController');

const passport = require('passport');

const {
  passportLocalStrategy,
  validateJoiUserSignUp,
} = require('../middleware/auth');

passport.use('local', passportLocalStrategy);

const router = require('express').Router();

router.get('/auth/sign-up', getSignUpPage);

router.post('/auth/sign-up', validateJoiUserSignUp, postSignUp);

router.post('/auth/sign-out', postSignOut);

router.get('/auth/sign-in', getSignInPage);

router.post(
  '/auth/sign-in',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/auth/sign-in',
  }),
  postSignIn
);

module.exports = router;
