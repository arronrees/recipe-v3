const { UUID, UUIDV4 } = require('sequelize');
const { db } = require('../lib/db');

const SavedRecipe = db.define('savedRecipe', {
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
});

SavedRecipe.sync({ force: false }).then(() => {
  console.log('SavedRecipe model synced');
});

module.exports = SavedRecipe;
