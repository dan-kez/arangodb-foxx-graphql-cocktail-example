const gql = require('graphql-sync');
const ingredientSchema = require('./ingredientSchema');

const dbDriver = require('../../../database/driver');

module.exports = {

  createIngredient: {
    type: gql.GraphQLBoolean,
    description: 'Create new ingredient',
    args: {
      newIngredient: {
        type: new gql.GraphQLNonNull(ingredientSchema.CreateIngredientInput)
      },
    },
    resolve(value, {newIngredient}) {
      return dbDriver.ingredientItems.save(newIngredient);
    },
  },

};
