const { isLoggedIn } = require('../middleware/auth');
const User = require('../models/User');

const router = require('express').Router();

router.get('/user', isLoggedIn, (req, res) => {
  res.render('user/index');
});

router.put('/user/update-details', async (req, res, next) => {
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
    return res.redirect('/user');
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
});

module.exports = router;
