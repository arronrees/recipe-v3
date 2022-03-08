const { createUser } = require('../lib/auth/createUser');
const User = require('../models/User');

module.exports.getSignUpPage = (req, res) => {
  res.render('auth/sign-up');
};

module.exports.postSignUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const emailLower = email.toLowerCase();

  const foundUser = await User.findOne({
    where: {
      email: emailLower,
    },
  });

  // return user already registered
  if (foundUser) {
    req.flash('infoMessage', 'Email already registered, please sign in');
    return res.redirect('/auth/sign-in');
  }

  const newUser = await createUser({
    firstName,
    lastName,
    email: emailLower,
    password,
  });

  if (!newUser) {
    req.flash('errorMessage', `Error creating user, please try again`);
    return res.redirect('/auth/sign-up');
  }
  if (newUser instanceof Error) {
    console.log(newUser);

    req.flash('errorMessage', `Error creating user, please try again`);
    return res.redirect('/auth/sign-up');
  }

  // save user to session
  const userToShow = { ...newUser.dataValues, password: null };

  req.login(userToShow, (err) => {
    if (err) next(err);

    req.flash('successMessage', 'User created successfully');
    res.redirect('/');
  });
};

module.exports.postSignOut = async (req, res) => {
  req.logout();
  req.flash('successMessage', 'Signed out successfully');

  res.redirect('/');
};

module.exports.getSignInPage = (req, res) => {
  res.render('auth/sign-in');
};

module.exports.postSignIn = async (req, res) => {
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;

  req.flash('successMessage', `Signed in successfully`);
  return res.redirect(redirectUrl);
};
