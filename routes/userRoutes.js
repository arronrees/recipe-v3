const {
  getUserPage,
  getUpdateUserDetails,
  putUpdateUserDetails,
  getUpdateUserPassword,
  putUpdateUserPassword,
  getLoggedInUserRecipes,
  getUserSavedRecipes,
  deleteUserAccount,
} = require('../controllers/userController');
const { isLoggedInRedirectTo } = require('../middleware/auth');

const router = require('express').Router();

router.get('/user', isLoggedInRedirectTo, getUserPage);

router.get('/user/update-details', isLoggedInRedirectTo, getUpdateUserDetails);

router.put('/user/update-details', isLoggedInRedirectTo, putUpdateUserDetails);

router.get(
  '/user/update-password',
  isLoggedInRedirectTo,
  getUpdateUserPassword
);

router.put(
  '/user/update-password',
  isLoggedInRedirectTo,
  putUpdateUserPassword
);

router.delete('/user/delete', isLoggedInRedirectTo, deleteUserAccount);

router.get('/user/my-recipes', isLoggedInRedirectTo, getLoggedInUserRecipes);

router.get('/user/saved-recipes', isLoggedInRedirectTo, getUserSavedRecipes);

module.exports = router;
