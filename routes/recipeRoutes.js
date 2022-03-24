const {
  getEditRecipe,
  putEditRecipe,
  postCreateRecipe,
  getCreateRecipe,
  getSingleRecipe,
  deleteSingleRecipe,
  postSaveRecipe,
  getCategoryRecipes,
  getUserRecipes,
  getSearchRecipes,
  postAddUserPhoto,
  deleteUserPhoto,
} = require('../controllers/recipeController');
const { isLoggedInRedirectTo, isRecipeAuthor } = require('../middleware/auth');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { validateParamsUUID } = require('../middleware/validation');

const storage = multer.diskStorage({
  destination: 'files/img/recipes',
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

const router = require('express').Router();

router.get('/recipe/category/:category', getCategoryRecipes);

router.get('/recipe/user/:id', getUserRecipes);

router.get('/recipe/search', getSearchRecipes);

router.get('/recipe/create', isLoggedInRedirectTo, getCreateRecipe);

router.post(
  '/recipe/create',
  isLoggedInRedirectTo,
  upload.single('image'),
  postCreateRecipe
);

router.get(
  '/recipe/edit/:id',
  isLoggedInRedirectTo,
  validateParamsUUID,
  isRecipeAuthor,
  getEditRecipe
);

router.get('/recipe/:id', validateParamsUUID, getSingleRecipe);

router.put(
  '/recipe/edit/:id',
  isLoggedInRedirectTo,
  validateParamsUUID,
  isRecipeAuthor,
  upload.single('image'),
  putEditRecipe
);

router.post(
  '/recipe/user-photos/:id/:userId',
  isLoggedInRedirectTo,
  validateParamsUUID,
  upload.single('image'),
  postAddUserPhoto
);

router.delete('/recipe/user-photos/:id', deleteUserPhoto);

router.delete(
  '/recipe/delete/:id',
  isLoggedInRedirectTo,
  validateParamsUUID,
  isRecipeAuthor,
  deleteSingleRecipe
);

router.post(
  '/recipe/save/:id',
  isLoggedInRedirectTo,
  validateParamsUUID,
  postSaveRecipe
);

module.exports = router;
