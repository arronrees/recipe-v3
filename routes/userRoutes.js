const {
  getUserPage,
  getUpdateUserDetails,
  putUpdateUserDetails,
  getUpdateUserPassword,
  putUpdateUserPassword,
} = require('../controllers/userController');
const { isLoggedInRedirectTo } = require('../middleware/auth');

const router = require('express').Router();

router.get('/user', isLoggedInRedirectTo, getUserPage);

router.get('/user/update-details', isLoggedInRedirectTo, getUpdateUserDetails);

router.put('/user/update-details', putUpdateUserDetails);

router.get(
  '/user/update-password',
  isLoggedInRedirectTo,
  getUpdateUserPassword
);

router.put('/user/update-password', putUpdateUserPassword);

module.exports = router;
