const { validate } = require('uuid');
const { Op } = require('sequelize');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const SavedRecipe = require('../models/SavedRecipe');
const UserPhoto = require('../models/UserPhoto');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

module.exports.getCreateRecipe = (req, res) => {
  res.render('recipe/create');
};

module.exports.postCreateRecipe = async (req, res) => {
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
    instructions,
  } = req.body;
  const { filename } = req.file;

  if (req.user.id !== userId) {
    req.flash(
      'errorMessage',
      'An error occured when trying to create recipe, please try again'
    );
    return res.redirect('/recipe/create');
  }

  const inputImg = fs.readFileSync(
    path.join(__dirname, `../files/img/recipes/${filename}`),
    (err, data) => {}
  );

  let outPutImgFilename = `${uuidv4()}-${Date.now()}.webp`;

  const outputImg = await sharp(inputImg)
    .resize(1200)
    .toFile(path.join(__dirname, `../files/img/recipes/${outPutImgFilename}`));

  if (!outputImg) {
    req.flash('errorMessage', 'Error creating recipe, please try again');
    return res.redirect('/recipe/create');
  }

  const removedImg = fs.unlinkSync(
    path.join(__dirname, `../files/img/recipes/${filename}`)
  );

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
  if (typeof categories === 'string') {
    cats.push(categories.toLowerCase());
  } else {
    categories.forEach((cat) => {
      if (cat !== '') {
        cats.push(cat.toLowerCase());
      }
    });
  }

  let ings = [];
  if (typeof ingredients === 'string') {
    ings.push(ingredients.toLowerCase());
  } else {
    ingredients.forEach((ing) => {
      if (ing !== '') {
        ings.push(ing.toLowerCase());
      }
    });
  }

  const newRecipe = await Recipe.create({
    userId,
    public,
    // is lowercase for search
    name: name.toLowerCase(),
    serves,
    difficulty,
    cookTimeHours,
    cookTimeMinutes,
    prepTimeHours,
    prepTimeMinutes,
    totalTimeHours,
    totalTimeMinutes,
    image: outPutImgFilename,
    categories: cats,
    ingredients: ings,
    instructions,
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

  if (!recipe.public) {
    if (req.user && recipe.userId === req.user.id) {
      // carry on
    } else {
      req.flash('errorMessage', 'No Recipe found');
      return res.redirect('/');
    }
  }

  const userPhotos = await UserPhoto.findAll({ where: { recipeId: id } });

  let currentUserSavedRecipes = null;

  if (req.user) {
    currentUserSavedRecipes = await UserPhoto.findAll({
      where: { userId: req.user.id },
    });
  }

  let savedRecipe = null;

  if (req.user) {
    savedRecipe = await SavedRecipe.findAll({
      where: { recipeId: id, userId: req.user.id },
    });
  }

  if (savedRecipe && savedRecipe.length === 0) {
    savedRecipe = null;
  }

  res.render('recipe/index', {
    recipe,
    savedRecipe,
    userPhotos,
    currentUserSavedRecipes,
  });
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
    instructions,
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

  // is lowercase for search
  recipe.name = name.toLowerCase();
  recipe.public = public;
  recipe.serves = serves;
  recipe.difficulty = difficulty;
  recipe.cookTimeHours = cookTimeHours;
  recipe.cookTimeMinutes = cookTimeMinutes;
  recipe.prepTimeHours = prepTimeHours;
  recipe.prepTimeMinutes = prepTimeMinutes;
  recipe.totalTimeHours = totalTimeHours;
  recipe.totalTimeMinutes = totalTimeMinutes;
  recipe.instructions = instructions;

  if (req.file) {
    let originalImage = recipe.image;

    const inputImg = fs.readFileSync(
      path.join(__dirname, `../files/img/recipes/${req.file.filename}`),
      (err, data) => {}
    );

    let outPutImgFilename = `${uuidv4()}-${Date.now()}.webp`;

    const outputImg = await sharp(inputImg)
      .resize(1200)
      .toFile(
        path.join(__dirname, `../files/img/recipes/${outPutImgFilename}`)
      );

    if (outputImg) {
      recipe.image = outPutImgFilename;
    }

    const removedImg = fs.unlinkSync(
      path.join(__dirname, `../files/img/recipes/${req.file.filename}`)
    );

    const removedOriginalImg = fs.unlinkSync(
      path.join(__dirname, `../files/img/recipes/${originalImage}`)
    );
  }

  let cats = [];
  if (typeof categories === 'string') {
    cats.push(categories.toLowerCase());
  } else {
    categories.forEach((cat) => {
      if (cat !== '') {
        cats.push(cat.toLowerCase());
      }
    });
  }

  let ings = [];
  if (typeof ingredients === 'string') {
    ings.push(ingredients.toLowerCase());
  } else {
    ingredients.forEach((ing) => {
      if (ing !== '') {
        ings.push(ing.toLowerCase());
      }
    });
  }

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

  const removedImg = fs.unlinkSync(
    path.join(__dirname, `../files/img/recipes/${recipe.image}`)
  );

  await recipe.destroy();

  const savedRecipes = await SavedRecipe.destroy({ where: { recipeId: id } });
  const userPhotos = await UserPhoto.findAll({ where: { recipeId: id } });

  for (let i = 0; i < userPhotos.length; i++) {
    const photo = userPhotos[i];

    const removedImg = fs.unlinkSync(
      path.join(__dirname, `../files/img/recipes/${photo.image}`)
    );

    if (!photo) {
      req.flash(
        'errorMessage',
        'An error occured when trying to delete photo, please try again'
      );
      return res.redirect(`/recipe/${id}`);
    }

    await photo.destroy();
  }

  req.flash('successMessage', 'Recipe deleted successfully');
  res.redirect('/');
};

module.exports.postSaveRecipe = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (req.user.id !== userId) {
    req.flash('errorMessage', 'Error saving recipe, please try again');
    return res.redirect(`/recipe/${id}`);
  }

  const savedRecipe = await SavedRecipe.findOne({
    where: { userId, recipeId: id },
  });

  if (!savedRecipe) {
    const newSave = await SavedRecipe.create({ userId, recipeId: id });

    req.flash('successMessage', 'Recipe saved successfully');
    return res.redirect(`/recipe/${id}`);
  }

  await savedRecipe.destroy();

  req.flash('successMessage', 'Recipe unsaved successfully');
  res.redirect(`/recipe/${id}`);
};

module.exports.getCategoryRecipes = async (req, res) => {
  const { category } = req.params;

  if (!category) {
    req.flash('infoMessage', 'No recipes with this category');
    return res.redirect('/');
  }

  const recipes = await Recipe.findAll({
    where: { public: true, categories: { [Op.contains]: [category] } },
    order: [['createdAt', 'DESC']],
  });

  res.render('recipe/category', { recipes, category });
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

module.exports.getSearchRecipes = async (req, res) => {
  const { searchText } = req.query;

  const searchQuery = searchText.replace(
    /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
    ''
  );

  const recipes = await Recipe.findAll({
    where: {
      [Op.or]: [
        {
          name: { [Op.substring]: searchQuery.toLowerCase() },
        },
        { categories: { [Op.contains]: [searchQuery.toLowerCase()] } },
        { ingredients: { [Op.contains]: [searchQuery.toLowerCase()] } },
      ],
    },
  });

  res.render('recipe/search', { recipes, searchQuery });
};

module.exports.postAddUserPhoto = async (req, res) => {
  const { id, userId } = req.params;
  const { filename } = req.file;

  if (req.user.id !== userId) {
    req.flash(
      'errorMessage',
      'An error occured when trying to add photo, please try again'
    );
    return res.redirect(`/recipe/${id}`);
  }

  const userPhotos = await UserPhoto.findAll({ where: { userId } });

  if (userPhotos.length >= 3) {
    req.flash('errorMessage', 'You have already added 3 images to this recipe');
    return res.redirect(`/recipe/${id}`);
  }

  const inputImg = fs.readFileSync(
    path.join(__dirname, `../files/img/recipes/${filename}`),
    (err, data) => {}
  );

  let outPutImgFilename = `${uuidv4()}-${Date.now()}.webp`;

  const outputImg = await sharp(inputImg)
    .resize(800)
    .toFile(path.join(__dirname, `../files/img/recipes/${outPutImgFilename}`));

  if (!outputImg) {
    req.flash('errorMessage', 'Error adding photo, please try again');
    return res.redirect(`/recipe/${id}`);
  }

  const removedImg = fs.unlinkSync(
    path.join(__dirname, `../files/img/recipes/${filename}`)
  );

  const newPhoto = await UserPhoto.create({
    recipeId: id,
    userId,
    image: outPutImgFilename,
  });

  if (!newPhoto) {
    req.flash(
      'errorMessage',
      'An error occured when trying to add photo, please try again'
    );
    return res.redirect(`/recipe/${id}`);
  }

  req.flash('successMessage', 'Photo successfully added');
  res.redirect(`/recipe/${id}`);
};

module.exports.deleteUserPhoto = async (req, res) => {
  const { id } = req.params;
  const { recipeId } = req.body;

  const deletedPhoto = await UserPhoto.findByPk(id);

  const removedImg = fs.unlinkSync(
    path.join(__dirname, `../files/img/recipes/${deletedPhoto.image}`)
  );

  if (!deletedPhoto) {
    req.flash(
      'errorMessage',
      'An error occured when trying to delete photo, please try again'
    );
    return res.redirect(`/recipe/${recipeId}`);
  }

  await deletedPhoto.destroy();

  req.flash('successMessage', 'Photo successfully deleted');
  res.redirect(`/recipe/${recipeId}`);
};
