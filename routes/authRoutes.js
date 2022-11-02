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
const { asyncHandler } = require('../utils/asyncHandler');

passport.use('local', passportLocalStrategy);

const router = require('express').Router();

router.get(
  '/auth/sign-up',
  isLoggedInRedirectAway,
  asyncHandler(getSignUpPage)
);

router.post('/auth/sign-up', validateJoiUserSignUp, asyncHandler(postSignUp));

router.post('/auth/sign-out', asyncHandler(postSignOut));

router.get(
  '/auth/sign-in',
  isLoggedInRedirectAway,
  asyncHandler(getSignInPage)
);

router.post(
  '/auth/sign-in',
  validateJoiUserSignIn,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/auth/sign-in',
  }),
  asyncHandler(postSignIn)
);

module.exports = router;
