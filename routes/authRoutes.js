const {
  getSignUpPage,
  postSignUp,
  postSignOut,
  getSignInPage,
  postSignIn,
} = require('../controllers/authController');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/User');
const { checkPassword } = require('../lib/auth/passwordUtils');

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function verify(email, password, done) {
      const foundUser = await User.findOne({
        where: {
          email,
        },
      });

      // user not found, redirect to signup
      if (!foundUser) {
        return done(null, false, {
          type: 'errorMessage',
          message: 'Incorrect credentials',
        });
      }

      const passwordMatches = await checkPassword(password, foundUser.password);

      // incorrect password
      if (!passwordMatches) {
        return done(null, false, {
          type: 'errorMessage',
          message: 'Incorrect credentials',
        });
      }

      return done(null, foundUser);
    }
  )
);

const router = require('express').Router();

router.get('/auth/sign-up', getSignUpPage);

router.post('/auth/sign-up', postSignUp);

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
