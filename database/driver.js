const db = require('@arangodb').db;
const ingredientItems = module.context.collection('ingredient');
const cocktailItems = module.context.collection('cocktail');
const usesIngredientItems = module.context.collection('uses_ingredient');

module.exports = {
  db: db,
  ingredientItems: ingredientItems,
  cocktailItems: cocktailItems,
  usesIngredientItems: usesIngredientItems,
};
