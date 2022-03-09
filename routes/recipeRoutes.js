const {
  getEditRecipe,
  putEditRecipe,
  postCreateRecipe,
  getCreateRecipe,
} = require('../controllers/recipeController');
const { isLoggedInRedirectTo, isRecipeAuthor } = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: 'files/img/recipes',
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});
const upload = multer({ storage });

const router = require('express').Router();

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
