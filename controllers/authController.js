module.exports.getSignUpPage = (req, res) => {
  res.render('auth/sign-up');
};

module.exports.postSignUp = async (req, res) => {
  res.send('ye');
};
