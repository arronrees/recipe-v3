const Joi = require('joi');
const { validate } = require('uuid');
const { joiRecipe } = require('../models/validation/joiRecipe');

module.exports.validateParamsUUID = (req, res, next) => {
  const { id } = req.params;

  if (!validate(id)) {
    req.flash('errorMessage', 'Item not found');
    return res.redirect('/');
  }

  next();
};

module.exports.validateRecipeObject = async (req, res, next) => {
  const { body } = req;
  const { error } = joiRecipe.validate(body);

  if (error) {
    if (Joi.isError(error)) {
      req.flash('errorMessage', 'Please fill out all the details correctly');
    } else {
      req.flash('errorMessage', 'Something went wrong, please try again');
    }

    return res.redirect('/recipe/create');
  }

  next();
};
