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
const { asyncHandler } = require('../utils/asyncHandler');

const router = require('express').Router();

router.get('/user', isLoggedInRedirectTo, getUserPage);

router.get(
  '/user/update-details',
  isLoggedInRedirectTo,
  asyncHandler(getUpdateUserDetails)
);

router.put(
  '/user/update-details',
  isLoggedInRedirectTo,
  asyncHandler(putUpdateUserDetails)
);

router.get(
  '/user/update-password',
  isLoggedInRedirectTo,
  asyncHandler(getUpdateUserPassword)
);

router.put(
  '/user/update-password',
  isLoggedInRedirectTo,
  asyncHandler(putUpdateUserPassword)
);

router.delete(
  '/user/delete',
  isLoggedInRedirectTo,
  asyncHandler(deleteUserAccount)
);

router.get(
  '/user/my-recipes',
  isLoggedInRedirectTo,
  asyncHandler(getLoggedInUserRecipes)
);

router.get(
  '/user/saved-recipes',
  isLoggedInRedirectTo,
  asyncHandler(getUserSavedRecipes)
);

module.exports = router;
