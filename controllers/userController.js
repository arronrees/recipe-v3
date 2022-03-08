const { checkPassword, hashPassword } = require('../lib/auth/passwordUtils');
const User = require('../models/User');

module.exports.getUserPage = (req, res) => {
  res.render('user/index');
};

module.exports.getUpdateUserDetails = (req, res) => {
  res.render('user/update-details');
};

module.exports.putUpdateUserDetails = async (req, res, next) => {
  if (!req.user) {
    req.session.returnTo = '/user';
    return res.redirect('/auth/sign-in');
  }

  const { body } = req;

  const user = await User.findOne({
    where: {
      id: body.id,
    },
  });

  if (user.id !== req.user.id) {
    req.logout();
    req.flash('errorMessage', 'Please login to edit this');
    return res.redirect('/user/update-details');
  }

  user.firstName = body.firstName;
  user.lastName = body.lastName;
  await user.save();

  const userToShow = { ...user, password: null };

  req.logout();
  req.login(userToShow, (err) => {
    if (err) next(err);

    req.flash('successMessage', 'User updated successfully');
    res.redirect('/user');
  });
};

module.exports.getUpdateUserPassword = (req, res) => {
  res.render('user/update-password');
};

module.exports.putUpdateUserPassword = async (req, res, next) => {
  if (!req.user) {
    req.session.returnTo = '/user';
    return res.redirect('/auth/sign-in');
  }

  const { id, currentPassword, newPassword } = req.body;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (user.id !== req.user.id) {
    req.logout();
    req.flash('errorMessage', 'Please login to edit this');
    return res.redirect('/user');
  }

  const passwordMatches = await checkPassword(currentPassword, user.password);

  if (!passwordMatches) {
    req.flash('errorMessage', 'Incorrect current password');
    return res.redirect('/user/update-password');
  }

  if (newPassword.length < 8) {
    req.flash(
      'errorMessage',
      'New password must have a minimum of 8 characters'
    );
    return res.redirect('/user/update-password');
  }

  if (currentPassword === newPassword) {
    req.flash(
      'errorMessage',
      'New password cannot be same as current password'
    );
    return res.redirect('/user/update-password');
  }

  const newHash = await hashPassword(newPassword);
  user.password = newHash;
  await user.save();

  const userToShow = { ...user, password: null };

  req.logout();
  req.login(userToShow, (err) => {
    if (err) next(err);

    req.flash('successMessage', 'Password updated successfully');
    res.redirect('/user');
  });
};
