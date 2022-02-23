const bcrypt = require('bcrypt');

module.exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

module.exports.checkPassword = async (enteredPassword, originalPassword) => {
  const checkedPassword = await bcrypt.compare(
    enteredPassword,
    originalPassword
  );

  return checkedPassword;
};
