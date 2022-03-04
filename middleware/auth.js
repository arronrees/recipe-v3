const LocalStrategy = require('passport-local');
const User = require('../models/User');
const { checkPassword } = require('../lib/auth/passwordUtils');
const { joiUserSignUp } = require('../models/validation/joiUser');
const Joi = require('joi');

module.exports.passportLocalStrategy = new LocalStrategy(
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
