const { DataTypes, UUID, UUIDV4 } = require('sequelize');
const { db } = require('../lib/db');

const User = db.define('user', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  firstName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(1024),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(1024),
    allowNull: false,
  },
});

User.sync({ force: false }).then(() => {
  console.log('User model synced');
});

module.exports = User;
