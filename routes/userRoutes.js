const {
  getUserPage,
  putUpdateUserDetails,
  putUpdateUserPassword,
} = require('../controllers/userController');
const { isLoggedInRedirectTo } = require('../middleware/auth');

const router = require('express').Router();

router.get('/user', isLoggedInRedirectTo, getUserPage);

router.put('/user/update-details', putUpdateUserDetails);

router.put('/user/update-password', putUpdateUserPassword);

module.exports = router;
