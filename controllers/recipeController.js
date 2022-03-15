const { validate } = require('uuid');
const { Op } = require('sequelize');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

module.exports.getCreateRecipe = (req, res) => {
  res.render('recipe/create');
};

module.exports.postCreateRecipe = async (req, res) => {
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
    categories,
    ingredients,
  } = req.body;
  const { filename } = req.file;

  if (req.user.id !== userId) {
    req.flash(
      'errorMessage',
      'An error occured when trying to create recipe, please try again'
    );
    return res.redirect('/recipe/create');
  }

  let totalTimeHours = parseFloat(prepTimeHours) + parseFloat(cookTimeHours);
  let totalTimeMinutes =
    parseFloat(prepTimeMinutes) + parseFloat(cookTimeMinutes);

  if (totalTimeMinutes === 120) {
    totalTimeMinutes = 0;
    totalTimeHours += 2;
  } else if (totalTimeMinutes >= 60) {
    let remainder = totalTimeMinutes % 60;
    totalTimeHours += 1;
    totalTimeMinutes = remainder;
  }

  let cats = [];
  categories.forEach((cat) => {
    if (cat !== '') {
      cats.push(cat.toLowerCase());
    }
  });

  let ings = [];
  ingredients.forEach((ing) => {
    if (ing !== '') {
      ings.push(ing.toLowerCase());
    }
  });

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
    totalTimeHours,
    totalTimeMinutes,
    image: filename,
    categories: cats,
    ingredients: ings,
    userName: `${req.user.firstName} ${req.user.lastName}`,
  });

  if (!newRecipe) {
    req.flash('errorMessage', 'Error creating recipe, please try again');
    return res.redirect('/recipe/create');
  }

  req.flash('successMessage', 'Recipe created successfully');
  res.redirect(`/recipe/${newRecipe.id}`);
};

module.exports.getSingleRecipe = async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findByPk(id);

  if (!recipe) {
    req.flash('errorMessage', 'No recipe found');
    return res.redirect('/');
  }

  res.render('recipe/index', { recipe });
};

module.exports.getEditRecipe = async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findByPk(id);

  res.render('recipe/edit', { recipe });
};

module.exports.putEditRecipe = async (req, res) => {
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
    categories,
    ingredients,
  } = req.body;

  const recipe = await Recipe.findByPk(id);

  if (req.user.id !== userId) {
    req.flash('errorMessage', 'You do not have permission to do this');
    return res.redirect(`/recipe/${recipe.id}`);
  }

  let totalTimeHours = parseFloat(prepTimeHours) + parseFloat(cookTimeHours);
  let totalTimeMinutes =
    parseFloat(prepTimeMinutes) + parseFloat(cookTimeMinutes);

  if (totalTimeMinutes === 120) {
    totalTimeMinutes = 0;
    totalTimeHours += 2;
  } else if (totalTimeMinutes >= 60) {
    let remainder = totalTimeMinutes % 60;
    totalTimeHours += 1;
    totalTimeMinutes = remainder;
  }

  recipe.name = name;
  recipe.public = public;
  recipe.serves = serves;
  recipe.difficulty = difficulty;
  recipe.cookTimeHours = cookTimeHours;
  recipe.cookTimeMinutes = cookTimeMinutes;
  recipe.prepTimeHours = prepTimeHours;
  recipe.prepTimeMinutes = prepTimeMinutes;
  recipe.totalTimeHours = totalTimeHours;
  recipe.totalTimeMinutes = totalTimeMinutes;

  if (req.file) {
    recipe.image = req.file.filename;
  }

  let cats = [];
  categories.forEach((cat) => {
    if (cat !== '') {
      cats.push(cat.toLowerCase());
    }
  });

  let ings = [];
  ingredients.forEach((ing) => {
    if (ing !== '') {
      ings.push(ing.toLowerCase());
    }
  });

  recipe.ingredients = ings;
  recipe.categories = cats;
  await recipe.save();

  req.flash('successMessage', 'Recipe updated successfully');
  res.redirect(`/recipe/${recipe.id}`);
};

module.exports.deleteSingleRecipe = async (req, res) => {
  const { id } = req.params;

  const recipe = await Recipe.findByPk(id);

  if (req.user.id !== recipe.userId) {
    req.flash('errorMessage', 'You do not have permission to do this');
    return res.redirect(`/recipe/${recipe.id}`);
  }

  await recipe.destroy();

  req.flash('successMessage', 'Recipe deleted successfully');
  res.redirect('/');
};

module.exports.postSaveRecipe = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!req.user) {
    res.session.returnTo = `/recipe/${id}`;
    req.flash('errorMessage', 'You need to login to save a recipe');
    return res.redirect('/auth/sign-in');
  }

  if (req.user.id !== userId) {
    req.flash('errorMessage', 'Error saving recipe, please try again');
    return res.redirect(`/recipe/${id}`);
  }

  const user = await User.findByPk(userId);

  if (user.savedRecipes.includes(id)) {
    user.savedRecipes = user.savedRecipes.filter((recipe) => recipe !== id);
    await user.save();

    const userToShow = { ...user, password: null };

    req.logout();
    return req.login(userToShow, (err) => {
      if (err) next(err);

      req.flash('successMessage', 'Recipe removed successfully');
      res.redirect(`/recipe/${id}`);
    });
  }

  user.savedRecipes = [...user.savedRecipes, id];
  await user.save();

  const userToShow = { ...user, password: null };

  req.logout();
  req.login(userToShow, (err) => {
    if (err) next(err);

    req.flash('successMessage', 'Recipe saved successfully');
    res.redirect(`/recipe/${id}`);
  });
};

module.exports.getCategoryRecipes = async (req, res) => {
  const { category } = req.query;

  if (!category) {
    req.flash('infoMessage', 'No recipes with this category');
    return res.redirect('/');
  }

  const recipes = await Recipe.findAll({
    where: { public: true, categories: { [Op.contains]: [category] } },
    order: [['createdAt', 'DESC']],
  });

  res.render('recipe/category', { recipes });
};

module.exports.getUserRecipes = async (req, res) => {
  const { id } = req.params;

  if (!validate(id)) {
    req.flash('errorMessage', 'User not found');
    return res.redirect('/');
  }

  const user = await User.findByPk(id);

  if (!user) {
    req.flash('errorMessage', 'No user found');
    return res.redirect('/');
  }

  const recipes = await Recipe.findAll({
    where: { public: true, userId: id },
    order: [['createdAt', 'DESC']],
  });

  if (recipes.length < 1) {
    req.flash('infoMessage', `This user hasn't added any recipes`);
    return res.redirect('/');
  }

  res.render('recipe/user', { recipes, recipeUser: user });
};
