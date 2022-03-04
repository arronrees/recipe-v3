const Joi = require('joi');

module.exports.joiUserSignUp = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
}).required();

module.exports.joiUserSignIn = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
}).required();
