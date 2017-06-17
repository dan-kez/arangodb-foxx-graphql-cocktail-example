const gql = require('graphql-sync');

module.exports = {

  Ingredient: new gql.GraphQLObjectType({
    name: 'Ingredient',
    description: 'A ingredient recipe',
    fields() {
      return {
        id: {
          type: new gql.GraphQLNonNull(gql.GraphQLString),
          description: 'The id of the ingredient.',
          resolve(ingredient) {
            return ingredient._key;
          },
        },
        name: {
          type: gql.GraphQLString,
          description: 'The name of the ingredient.',
        },
      };
    },
  }),

  CreateIngredientInput: new gql.GraphQLInputObjectType({
    name: 'CreateIngredientInput',
    fields() {
      return {
        id: {
          type: gql.GraphQLString,
          description: 'The id of the ingredient.',
          resolve(ingredient) {
            return ingredient._key;
          },
        },
        name: {
          type: new gql.GraphQLNonNull(gql.GraphQLString),
          description: 'The name of the ingredient.',
        },
      };
    },
  }),

};
