const { validate } = require('uuid');

module.exports.validateParamsUUID = (req, res, next) => {
  const { id } = req.params;

  if (!validate(id)) {
    req.flash('errorMessage', 'Item not found');
    return res.redirect('/');
  }

  next();
};
