const Joi = require('joi');

module.exports.joiRecipe = Joi.object({
  name: Joi.string().required(),
}).required();
