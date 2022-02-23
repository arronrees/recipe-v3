const User = require('../../models/User');
const { hashPassword } = require('./passwordUtils');

module.exports.createUser = async (user) => {
  try {
    const hash = await hashPassword(user.password);
    const newUser = { ...user, password: hash };

    const createdUser = await User.create(newUser);

    return createdUser;
  } catch (err) {
    console.log(err);
    return err;
  }
};
