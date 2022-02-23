const { createUser } = require('../lib/auth/createUser');
const User = require('../models/User');

module.exports.getSignUpPage = (req, res) => {
  res.render('auth/sign-up');
};

module.exports.postSignUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const foundUser = await User.findOne({
    where: {
      email,
    },
  });

  // return user already registered
  if (foundUser) {
    return res.send('Email already registered, please sign in');
  }

  const newUser = await createUser({ firstName, lastName, email, password });

  res.send('ye');
};
