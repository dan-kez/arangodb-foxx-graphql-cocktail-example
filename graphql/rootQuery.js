const gql = require('graphql-sync');
const ingredientQuery = require('./models/ingredient/ingredientQuery');
const cocktailQuery = require('./models/cocktail/cocktailQuery');


const rootFields = Object.assign({},
  ingredientQuery,
  cocktailQuery
);

module.exports = new gql.GraphQLObjectType({
  name: 'RootQuery',
  fields: () => rootFields
});
