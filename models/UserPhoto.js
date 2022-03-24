const { DataTypes, UUID, UUIDV4 } = require('sequelize');
const { db } = require('../lib/db');

const UserPhoto = db.define('userPhoto', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  recipeId: {
    type: UUID,
    allowNull: false,
  },
  userId: {
    type: UUID,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(1024),
  },
});

UserPhoto.sync({ force: false }).then(() => {
  console.log('UserPhoto model synced');
});

module.exports = UserPhoto;
