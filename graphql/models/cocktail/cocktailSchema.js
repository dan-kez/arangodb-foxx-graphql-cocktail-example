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
            // Example with Graph API
            return dbDriver.recipeGraph._neighbors(cocktail._id, {direction: 'outbound'})
              .map(vertexId => {
                return dbDriver.recipeGraph._vertices(vertexId)[0];
              })
              .sort((a,b) => a._key.localeCompare(b._key));

            // Example with AQL Query:
            // return dbDriver.db._query(aqlQuery`
            //   FOR ingredient IN OUTBOUND ${cocktail._id} ${dbDriver.usesIngredientItems}
            //   SORT ingredient._key ASC
            //   RETURN ingredient
            // `).toArray();
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
        ingredientIds: {
          type: new gql.GraphQLNonNull( new gql.GraphQLList(gql.GraphQLString)),
          description: 'A list of ingredient ids that are used to create this cocktail. Must supply at least one ingredient.',
        },
      };
    },
  }),

};
