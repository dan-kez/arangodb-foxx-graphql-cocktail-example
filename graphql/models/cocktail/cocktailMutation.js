const gql = require('graphql-sync');
const cocktailSchema = require('./cocktailSchema');

const dbDriver = require('../../../database/driver');

module.exports = {

  createCocktail: {
    type: gql.GraphQLBoolean,
    description: 'Create new cocktail',
    args: {
      newCocktail: {
        type: new gql.GraphQLNonNull(cocktailSchema.CreateCocktailInput)
      },
    },
    resolve(value, {newCocktail}) {
      return dbDriver.cocktailItems.save(newCocktail);
    },
  },

};
