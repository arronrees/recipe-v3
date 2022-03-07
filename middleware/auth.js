const LocalStrategy = require('passport-local');
const User = require('../models/User');
const { checkPassword } = require('../lib/auth/passwordUtils');
const {
  joiUserSignUp,
  joiUserSignIn,
} = require('../models/validation/joiUser');
const Joi = require('joi');

module.exports.passportLocalStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async function verify(email, password, done) {
    const emailLower = email.toLowerCase();

    const foundUser = await User.findOne({
      where: {
        email: emailLower,
      },
    });

    // user not found, redirect to signup
    if (!foundUser) {
      return done(null, false, {
        type: 'errorMessage',
        message: 'Incorrect credentials, please try again',
      });
    }

    const passwordMatches = await checkPassword(password, foundUser.password);

    // incorrect password
    if (!passwordMatches) {
      return done(null, false, {
        type: 'errorMessage',
        message: 'Incorrect credentials, please try again',
      });
    }

    return done(null, foundUser);
  }
);

module.exports.validateJoiUserSignUp = async (req, res, next) => {
  const { body } = req;
  const { error } = joiUserSignUp.validate(body);

  if (error) {
    if (Joi.isError(error)) {
      req.flash('errorMessage', error.message.replaceAll('"', ''));
    } else {
      req.flash('errorMessage', 'Something went wrong, please try again');
    }
    return res.redirect('/auth/sign-up');
  }

  next();
};

module.exports.validateJoiUserSignIn = async (req, res, next) => {
  const { body } = req;
  const { error } = joiUserSignIn.validate(body);

  if (error) {
    if (Joi.isError(error)) {
      req.flash('errorMessage', 'Incorrect credentials, please try again');
    } else {
      req.flash('errorMessage', 'Something went wrong, please try again');
    }
    return res.redirect('/auth/sign-up');
  }

  next();
};

module.exports.isLoggedInRedirectTo = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;

    req.flash('errorMessage', 'Please sign in to view this content');
    return res.redirect('/auth/sign-in');
  }

  next();
};

module.exports.isLoggedInRedirectAway = async (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash('infoMessage', 'Already signed in');
    return res.redirect('/user');
  }

  next();
};
