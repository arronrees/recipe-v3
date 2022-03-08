const { isLoggedInRedirectTo, isRecipeAuthor } = require('../middleware/auth');
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
    cookTimeHours,
    cookTimeMinutes,
    prepTimeHours,
    prepTimeMinutes,
    totalTime,
  });

  if (!newRecipe) {
    req.flash('errorMessage', 'Error creating recipe, please try again');
    return res.redirect('/recipe/create');
  }

  req.flash('successMessage', 'Recipe created successfully');
  res.redirect('/');
});

router.get(
  '/recipe/edit/:id',
  isLoggedInRedirectTo,
  // isRecipeAuthor,
  async (req, res) => {
    const { id } = req.params;

    const recipe = await Recipe.findByPk(id);

    res.render('recipe/edit', { recipe });
  }
);

router.put(
  '/recipe/edit/:id',
  isLoggedInRedirectTo,
  isRecipeAuthor,
  async (req, res) => {
    const { id } = req.params;
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

    const recipe = await Recipe.findByPk(id);

    if (req.user.id !== userId) {
      req.logout();
      req.session.returnTo = `/recipe/edit/${id}`;
      return res.redirect('/auth/sign-in');
    }

    // convert all times to mins
    const prepTotal =
      parseFloat(prepTimeHours) * 60 + parseFloat(prepTimeMinutes);
    const cookTotal =
      parseFloat(cookTimeHours) * 60 + parseFloat(cookTimeMinutes);
    const totalTime = prepTotal + cookTotal;

    recipe.name = name;
    recipe.public = public;
    recipe.serves = serves;
    recipe.difficulty = difficulty;
    recipe.cookTimeHours = cookTimeHours;
    recipe.cookTimeMinutes = cookTimeMinutes;
    recipe.prepTimeHours = prepTimeHours;
    recipe.prepTimeMinutes = prepTimeMinutes;
    recipe.totalTime = totalTime;

    await recipe.save();

    req.flash('successMessage', 'Recipe updated successfully');
    res.redirect('/');
  }
);

module.exports = router;
