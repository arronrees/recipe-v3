const { isLoggedInRedirectTo } = require('../middleware/auth');
const Recipe = require('../models/Recipe');

const router = require('express').Router();

router.get('/recipe/create', isLoggedInRedirectTo, (req, res) => {
  res.render('recipe/create');
});

router.post('/recipe/create', async (req, res) => {
  if (!req.user) {
    req.session.returnTo = '/recipe/create';
    return res.redirect('/auth/sign-in');
  }

  const {
    userId,
    public,
    name,
    serves,
    difficulty,
    cookTimeHours,
    cookTimeMinutes,
    prepTimeHours,
    prepTimeMinutes,
  } = req.body;

  // convert all times to mins
  const prepTotal =
    parseFloat(prepTimeHours) * 60 + parseFloat(prepTimeMinutes);
  const cookTotal =
    parseFloat(cookTimeHours) * 60 + parseFloat(cookTimeMinutes);
  const totalTime = prepTotal + cookTotal;

  const newRecipe = await Recipe.create({
    userId,
    public,
    name,
    serves,
    difficulty,
    cookTime: cookTotal,
    prepTime: prepTotal,
    totalTime,
  });

  if (!newRecipe) {
    req.flash('errorMessage', 'Error creating recipe, please try again');
    return res.redirect('/recipe/create');
  }

  req.flash('successMessage', 'Recipe created successfully');
  res.redirect('/');
});

module.exports = router;
