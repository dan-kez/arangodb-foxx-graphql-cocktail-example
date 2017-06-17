const gql = require('graphql-sync');
const cocktailSchema = require('./cocktailSchema');

const dbDriver = require('../../../database/driver');

module.exports = {

  getCocktails: {
    type: new gql.GraphQLList(cocktailSchema.Cocktail),
    description: 'Return all cocktails in the database',
    resolve() {
      return dbDriver.cocktailItems.all();
    },
  },

  getCocktailById: {
    type: cocktailSchema.Cocktail,
    description: 'Get an Cocktail by its ID',
    args: {
      id: {
        description: 'The cocktail id',
        type: new gql.GraphQLNonNull(gql.GraphQLString),
      },
    },
    resolve(root, args) {
      return dbDriver.cocktailItems.firstExample({
        _key: args.id,
      });
    },
  },

};
