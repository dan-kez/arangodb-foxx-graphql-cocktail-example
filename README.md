# Example ArangoDB Foxx Microservice

This example repo showcases a simple graphql implementation around a simple cocktail / ingredient schema. In particular it exemplifies good directory structure, mutations, and connected objects.

# Get it running!

To get this working go ahead and grab arangodb version `3.1` . If you have docker you can run the following line.

> Note: This has only been tested on `3.1.22`.

```
docker run -e ARANGO_NO_AUTH=1 -p 8529:8529 -d --name arangodb-instance -d arangodb/arangodb:3.1
```

Direct your browser to `localhost:8529` navigate to `Services` using the left navigation bar. Click `Add Service` and add via GitHub.

Boom. You should be good to go!

# Usage

The `setup.js` script initializes one cocktail for you. You can use the built in mutation end-points to add more.

Unless you renamed the service you should be able to reach the GraphQL end point using the following URL:

http://localhost:8529/_db/_system/cocktail-app/graphql

For Example:

You can then query for all cocktails:

```
{
  getCocktails {
    id,
    name
    ingredients {
      id,
      name
    }
  }
}
```

See the documenation on the GraphiQL endpoint (above url) for mutations and data structure.

# Usefull tidbits

You can reset the database by running the following calls. The same end points are accessible via the services UI arangodb.

```
foxx-manager teardown "/cocktail-app"
foxx-manager setup "/cocktail-app"
```

If you're debugging a GraphQL endpoint and don't have enough info you can print out the stack trace in one of two ways.
- Extending `GraphQLError` with a custom error.
- Edit the following file and add an `stack: error.stack` line to the error object. If you do this make sure you restart your docker container.

```
/usr/share/arangodb3/js/node/node_modules/graphql-sync/node_modules/graphql/error/formatError.js
```

# License

Copyright (c) 2017 Daniel Kezezerashvili

License: MIT License
