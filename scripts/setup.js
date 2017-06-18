'use strict';
const graphModule =  require('@arangodb/general-graph');
const graphName = module.context.collectionName('recipe');

if (graphModule._exists(graphName)) {
  // eslint-disable-next-line no-console
  console.warn(`Graph ${graphName} already exists. Leaving it untouched.`);
}
else {
  graphModule._create(graphName, [
    graphModule._relation(
      module.context.collectionName('uses_ingredient'),
      [module.context.collectionName('cocktail')],
      [module.context.collectionName('ingredient')]
    )
  ]);

  // Let's make sure there are not duplicate relationships. We'll also put a unique constraint on names.
  const usesIngredientCollection = module.context.collection('uses_ingredient');
  usesIngredientCollection.ensureIndex({type: 'hash', fields: ['_from', '_to'], unique: true});

  const cocktailCollection = module.context.collection('cocktail');
  cocktailCollection.ensureIndex({type: 'hash', fields: ['name'], unique: true});

  const ingredientCollection = module.context.collection('ingredient');
  ingredientCollection.ensureIndex({type: 'hash', fields: ['name'], unique: true});

  // Let's add one cocktail with associated ingredients to preload the database
  const cosmo = cocktailCollection.save({
    name: 'whisky sour',
  });

  for (const i of ['whisky', 'lemon juice', 'simple syrup', 'lime juice']) {
    const ing_id = ingredientCollection.save({name: i})._id;

    usesIngredientCollection.insert({
      _from: cosmo._id,
      _to: ing_id,
    });
  }

}

