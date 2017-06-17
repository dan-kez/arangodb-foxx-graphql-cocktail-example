'use strict';
const createGraphQLRouter = require('@arangodb/foxx/graphql');
const graphqlSchema = require('./graphql/rootSchema');

module.context.use('/graphql', createGraphQLRouter({
  schema: graphqlSchema,
  graphiql: true
}));
