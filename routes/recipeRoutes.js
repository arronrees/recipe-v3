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

router.get('/recipe/category/:category', getCategoryRecipes);

router.get('/recipe/user/:id', getUserRecipes);

router.get('/recipe/search', getSearchRecipes);

router.get('/recipe/create', isLoggedInRedirectTo, getCreateRecipe);

router.post(
  '/recipe/create',
  isLoggedInRedirectTo,
  upload.single('image'),
  validateRecipeObject,
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
  validateRecipeObject,
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
