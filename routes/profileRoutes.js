const { isLoggedIn } = require('../middleware/auth');

const router = require('express').Router();

router.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile/index');
});

module.exports = router;
