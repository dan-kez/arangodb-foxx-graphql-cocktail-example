'use strict';
const db = require('@arangodb').db;
const graphModule =  require('@arangodb/general-graph');

const collections = [
  'cocktail',
  'ingredient',
  'uses_ingredient'
];

for (const localName of collections) {
  const qualifiedName = module.context.collectionName(localName);
  db._drop(qualifiedName);
}
const graphName = module.context.collectionName('recipe');
graphModule._drop(graphName);
