const {
  getUserPage,
  putUpdateUserDetails,
  putUpdateUserPassword,
} = require('../controllers/userController');
const { isLoggedIn } = require('../middleware/auth');

const router = require('express').Router();

router.get('/user', isLoggedIn, getUserPage);

router.put('/user/update-details', putUpdateUserDetails);

router.put('/user/update-password', putUpdateUserPassword);

module.exports = router;
