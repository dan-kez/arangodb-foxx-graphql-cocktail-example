const gql = require('graphql-sync');

const rootQuery = require('./rootQuery');
const rootMutation = require('./rootMutation');

module.exports = new gql.GraphQLSchema({
  query: rootQuery,
  mutation: rootMutation,
});
