const Recipe = require('../models/Recipe');

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
  } = req.body;
  const { filename, path, destination } = req.file;
  console.log(req.file);

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
    image: filename,
  });

  if (!newRecipe) {
    req.flash('errorMessage', 'Error creating recipe, please try again');
    return res.redirect('/recipe/create');
  }

  req.flash('successMessage', 'Recipe created successfully');
  res.redirect('/');
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
};
