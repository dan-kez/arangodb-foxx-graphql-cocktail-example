/*global aqlQuery:true */
const gql = require('graphql-sync');
const ingredientSchema = require('../ingredient/ingredientSchema');

const dbDriver = require('../../../database/driver');

module.exports = {

  Cocktail: new gql.GraphQLObjectType({
    name: 'Cocktail',
    description: 'A cocktail recipe',
    fields() {
      return {
        id: {
          type: new gql.GraphQLNonNull(gql.GraphQLString),
          description: 'The id of the cocktail.',
          resolve(cocktail) {
            return cocktail._key;
          },
        },
        name: {
          type: gql.GraphQLString,
          description: 'The name of the cocktail.',
        },
         /* GraphQL sugar */
        ingredients: {
          type: new gql.GraphQLList(ingredientSchema.Ingredient),
          description: 'List of ingredients',
          resolve(cocktail) {
            // Interested in OUTBOUND edges
            return dbDriver.db._query(aqlQuery`
              FOR ingredient IN OUTBOUND ${cocktail._id} ${dbDriver.usesIngredientItems}
              SORT ingredient._key ASC
              RETURN ingredient
            `).toArray();
          },
        },
      };
    },
  }),

  CreateCocktailInput: new gql.GraphQLInputObjectType({
    name: 'CreateCocktailInput',
    fields() {
      return {
        id: {
          type: gql.GraphQLString,
          description: 'The id of the cocktail.',
          resolve(cocktail) {
            return cocktail._key;
          },
        },
        name: {
          type: new gql.GraphQLNonNull(gql.GraphQLString),
          description: 'The name of the cocktail.',
        },
      };
    },
  }),

};
