'use strict';
const graphql = require('graphql-sync');
const createGraphQLRouter = require('@arangodb/foxx/graphql');

var graphqlSchema = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: graphql.GraphQLString,
        resolve() {
          return 'world';
        }
      }
    }
  })
});

var query = '{ hello }';

var result = graphql.graphql(graphqlSchema, query);

// Prints
// {
//   data: { hello: "world" }
// }
console.log(result);

module.context.use('/graphql', createGraphQLRouter({
  schema: graphqlSchema,
  graphiql: true
}));

module.context.use('/cocktail', require('./routes/cocktail'), 'cocktail');
// module.context.use('/ingredient', require('./routes/ingredient'), 'ingredient');
// module.context.use('/uses_ingredient', require('./routes/uses_ingredient'), 'uses_ingredient');
