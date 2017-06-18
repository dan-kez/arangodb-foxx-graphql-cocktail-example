const db = require('@arangodb').db;
const graphModule =  require('@arangodb/general-graph');

const recipeGraphName = module.context.collectionName('recipe');
const recipeGraph = graphModule._graph(recipeGraphName);

const ingredientItems = recipeGraph[module.context.collectionName('ingredient')];
const cocktailItems = recipeGraph[module.context.collectionName('cocktail')];
const usesIngredientItems = recipeGraph[module.context.collectionName('uses_ingredient')];


module.exports = {
  db: db,
  ingredientItems: ingredientItems,
  cocktailItems: cocktailItems,
  usesIngredientItems: usesIngredientItems,
  recipeGraph: recipeGraph,
};
