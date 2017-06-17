const gql = require('graphql-sync');
const ingredientMutation = require('./models/ingredient/ingredientMutation');
const cocktailMutation = require('./models/cocktail/cocktailMutation');


const rootFields = Object.assign({},
  ingredientMutation,
  cocktailMutation
);

module.exports = new gql.GraphQLObjectType({
  name: 'RootMutation',
  fields: () => rootFields
});
