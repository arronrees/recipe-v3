const Joi = require('joi');

module.exports.joiRecipe = Joi.object({
  name: Joi.string().required(),
  serves: Joi.string().required(),
  difficulty: Joi.string().required(),
  cookTimeHours: Joi.number().required(),
  cookTimeMinutes: Joi.number().required(),
  prepTimeHours: Joi.number().required(),
  prepTimeMinutes: Joi.number().required(),
  categories: [Joi.string(), Joi.array()],
  ingredients: [Joi.string(), Joi.array()],
  instructions: Joi.string().required(),
  public: Joi.boolean().required(),
  userId: Joi.string(),
}).required();
