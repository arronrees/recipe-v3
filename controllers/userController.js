const { checkPassword, hashPassword } = require('../lib/auth/passwordUtils');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const SavedRecipe = require('../models/SavedRecipe');

module.exports.getUserPage = (req, res) => {
  res.render('user/index');
};

module.exports.getUpdateUserDetails = (req, res) => {
  res.render('user/update-details');
};

module.exports.putUpdateUserDetails = async (req, res, next) => {
  const { body } = req;

  const user = await User.findOne({
    where: {
      id: body.id,
    },
  });

  if (user.id !== req.user.id) {
    req.logout();
    req.flash('errorMessage', 'Please login to edit this');
    return res.redirect('/user/update-details');
  }

  user.firstName = body.firstName;
  user.lastName = body.lastName;
  await user.save();

  const userToShow = { ...user, password: null };

  req.logout();
  req.login(userToShow, (err) => {
    if (err) next(err);

    req.flash('successMessage', 'User updated successfully');
    res.redirect('/user');
  });
};

module.exports.getUpdateUserPassword = (req, res) => {
  res.render('user/update-password');
};

module.exports.putUpdateUserPassword = async (req, res, next) => {
  const { id, currentPassword, newPassword } = req.body;

  const user = await User.findOne({
    where: {
      id,
    },
  });

  if (user.id !== req.user.id) {
    req.logout();
    req.flash('errorMessage', 'Please login to edit this');
    return res.redirect('/user');
  }

  const passwordMatches = await checkPassword(currentPassword, user.password);

  if (!passwordMatches) {
    req.flash('errorMessage', 'Incorrect current password');
    return res.redirect('/user/update-password');
  }

  if (newPassword.length < 8) {
    req.flash(
      'errorMessage',
      'New password must have a minimum of 8 characters'
    );
    return res.redirect('/user/update-password');
  }

  if (currentPassword === newPassword) {
    req.flash(
      'errorMessage',
      'New password cannot be same as current password'
    );
    return res.redirect('/user/update-password');
  }

  const newHash = await hashPassword(newPassword);
  user.password = newHash;
  await user.save();

  const userToShow = { ...user, password: null };

  req.logout();
  req.login(userToShow, (err) => {
    if (err) next(err);

    req.flash('successMessage', 'Password updated successfully');
    res.redirect('/user');
  });
};

module.exports.deleteUserAccount = async (req, res) => {
  const { id } = req.body;

  if (req.user.id !== id) {
    req.flash('errorMessage', 'You can only delete your own account');
    return res.redirect('/user');
  }

  const user = await User.destroy({ where: { id } });
  const recipes = await Recipe.destroy({ where: { userId: id } });

  req.flash('successMessage', 'User deleted successfully');
  req.logout();
  res.redirect('/');
};

module.exports.getLoggedInUserRecipes = async (req, res) => {
  const id = req.user.id;
  const recipes = await Recipe.findAll({
    where: { userId: id },
    order: [['createdAt', 'DESC']],
  });

  res.render('user/my-recipes', { recipes });
};

module.exports.getUserSavedRecipes = async (req, res) => {
  const id = req.user.id;

  const savedRecipes = await SavedRecipe.findAll({
    where: { userId: id },
    order: [['createdAt', 'DESC']],
  });

  let recipes = [];

  for (let i = 0; i < savedRecipes.length; i++) {
    const recipe = await Recipe.findOne({
      where: { public: true, id: savedRecipes[i].recipeId },
    });
    if (recipe) recipes.push(recipe);
  }

  res.render('user/saved-recipes', { recipes });
};
