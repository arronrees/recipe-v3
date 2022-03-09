const { DataTypes, UUID, UUIDV4 } = require('sequelize');
const { db } = require('../lib/db');

const Recipe = db.define('recipe', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  userId: {
    type: UUID,
    allowNull: false,
  },
  public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  name: {
    type: DataTypes.STRING(1024),
    allowNull: false,
  },
  serves: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  difficulty: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  cookTimeHours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cookTimeMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prepTimeHours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  prepTimeMinutes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING(1024),
  },
});

Recipe.sync({ force: false }).then(() => {
  console.log('Recipe model synced');
});

module.exports = Recipe;
