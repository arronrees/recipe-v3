const {
  getEditRecipe,
  putEditRecipe,
  postCreateRecipe,
  getCreateRecipe,
} = require('../controllers/recipeController');
const { isLoggedInRedirectTo, isRecipeAuthor } = require('../middleware/auth');

const router = require('express').Router();

router.get('/recipe/create', isLoggedInRedirectTo, getCreateRecipe);

router.post('/recipe/create', isLoggedInRedirectTo, postCreateRecipe);

router.get(
  '/recipe/edit/:id',
  isLoggedInRedirectTo,
  isRecipeAuthor,
  getEditRecipe
);

router.put(
  '/recipe/edit/:id',
  isLoggedInRedirectTo,
  isRecipeAuthor,
  putEditRecipe
);

module.exports = router;
