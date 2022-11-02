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
const {
  validateParamsUUID,
  validateRecipeObject,
} = require('../middleware/validation');
const { asyncHandler } = require('../utils/asyncHandler');

const storage = multer.diskStorage({
  destination: 'files/img/recipes',
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/webp'
  ) {
    return cb(null, true);
  } else {
    return cb(null, false);
  }
};

const upload = multer({
  fileFilter,
  storage,
  limits: { fileSize: 2097152 },
});

const router = require('express').Router();

router.get('/recipe/category/:category', asyncHandler(getCategoryRecipes));

router.get('/recipe/user/:id', asyncHandler(getUserRecipes));

router.get('/recipe/search', asyncHandler(getSearchRecipes));

router.get(
  '/recipe/create',
  isLoggedInRedirectTo,
  asyncHandler(getCreateRecipe)
);

router.post(
  '/recipe/create',
  isLoggedInRedirectTo,
  upload.single('image'),
  validateRecipeObject,
  asyncHandler(postCreateRecipe)
);

router.get(
  '/recipe/edit/:id',
  isLoggedInRedirectTo,
  validateParamsUUID,
  isRecipeAuthor,
  asyncHandler(getEditRecipe)
);

router.get('/recipe/:id', validateParamsUUID, getSingleRecipe);

router.put(
  '/recipe/edit/:id',
  isLoggedInRedirectTo,
  validateParamsUUID,
  isRecipeAuthor,
  upload.single('image'),
  validateRecipeObject,
  asyncHandler(putEditRecipe)
);

router.post(
  '/recipe/user-photos/:id/:userId',
  isLoggedInRedirectTo,
  validateParamsUUID,
  upload.single('image'),
  asyncHandler(postAddUserPhoto)
);

router.delete('/recipe/user-photos/:id', asyncHandler(deleteUserPhoto));

router.delete(
  '/recipe/delete/:id',
  isLoggedInRedirectTo,
  validateParamsUUID,
  isRecipeAuthor,
  asyncHandler(deleteSingleRecipe)
);

router.post(
  '/recipe/save/:id',
  isLoggedInRedirectTo,
  validateParamsUUID,
  asyncHandler(postSaveRecipe)
);

module.exports = router;
