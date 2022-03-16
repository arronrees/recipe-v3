const {
  getUserPage,
  getUpdateUserDetails,
  putUpdateUserDetails,
  getUpdateUserPassword,
  putUpdateUserPassword,
  getLoggedInUserRecipes,
  getUserSavedRecipes,
} = require('../controllers/userController');
const { isLoggedInRedirectTo } = require('../middleware/auth');

const router = require('express').Router();

router.use(isLoggedInRedirectTo);

router.get('/user', getUserPage);

router.get('/user/update-details', getUpdateUserDetails);

router.put('/user/update-details', putUpdateUserDetails);

router.get('/user/update-password', getUpdateUserPassword);

router.put('/user/update-password', putUpdateUserPassword);

router.get('/user/my-recipes', getLoggedInUserRecipes);

router.get('/user/saved-recipes', getUserSavedRecipes);

module.exports = router;
