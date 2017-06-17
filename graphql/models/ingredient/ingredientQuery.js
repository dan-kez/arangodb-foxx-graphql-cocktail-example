const gql = require('graphql-sync');
const ingredientSchema = require('./ingredientSchema');

const dbDriver = require('../../../database/driver');

module.exports = {

  getIngredients: {
    type: new gql.GraphQLList(ingredientSchema.Ingredient),
    description: 'Return all ingredients in the database',
    resolve() {
      return dbDriver.ingredientItems.all();
    },
  },

  getIngredientById: {
    type: ingredientSchema.Ingredient,
    description: 'Get an Ingredient by its ID',
    args: {
      id: {
        description: 'The ingredient id',
        type: new gql.GraphQLNonNull(gql.GraphQLString),
      },
    },
    resolve(root, args) {
      return dbDriver.ingredientItems.firstExample({
        _key: args.id,
      });
    },
  },

};
