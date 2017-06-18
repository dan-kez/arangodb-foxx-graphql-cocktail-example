const gql = require('graphql-sync');
const cocktailSchema = require('./cocktailSchema');

const dbDriver = require('../../../database/driver');

module.exports = {

  createCocktail: {
    type: cocktailSchema.Cocktail,
    description: 'Create new cocktail',
    args: {
      newCocktail: {
        type: new gql.GraphQLNonNull(cocktailSchema.CreateCocktailInput)
      },
    },
    resolve(value, {newCocktail}) {
      const cocktailEntity = Object.keys(newCocktail)
        .filter(i => { return i !== 'ingredientIds'; })
        .reduce((acc, key) => {
          acc[key] = newCocktail[key];
          return acc;
        }, {});

      const inputIngredientIds = newCocktail.ingredientIds
        // Make sure each item in the list is unique
        .filter((i, pos, arr) => arr.indexOf(i) === pos );

      if (inputIngredientIds.length > 0) {
        const existingIngredientIds = inputIngredientIds
          // Check if the id exists in our ingredient collection
          .map(id => dbDriver.ingredientItems.exists(id))
          // Remove items that do not exist (false items)
          .filter(i => i);

        // If all the ingredients exist then add the cocktail & make the edges.
        if (existingIngredientIds.length === inputIngredientIds.length) {
          const savedCocktail = dbDriver.cocktailItems.save(cocktailEntity, {
            returnNew: true,
          }).new;

          for (const ingredient of existingIngredientIds) {
            dbDriver.usesIngredientItems.insert({
              _from: savedCocktail._id,
              _to: ingredient._id,
            });
          }
          return savedCocktail;
        }
        else {
          throw new gql.GraphQLError({
            message: 'Some of your ingredients do not exist.',
          });
        }
      }
      else {
        throw new gql.GraphQLError({
          message: 'You must provide a non-empty list of ingredientIds',
        });
      }
    },
  },

  addIngredientToCocktail: {
    type: cocktailSchema.Cocktail,
    description: 'Create a relationship from a Cocktail to an Ingredient. The specifies the Cocktail uses this Ingredient',
    args: {
      cocktailId: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'The Cocktail ID',
      },
      ingredientId: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'The Ingredient ID',
      },
    },
    resolve(value, {cocktailId, ingredientId}) {
      const cocktail = dbDriver.cocktailItems.exists(cocktailId);
      const ingredient = dbDriver.ingredientItems.exists(ingredientId);

      if (cocktail && ingredient) {
        return dbDriver.usesIngredientItems.insert({
          _from: cocktail._id,
          _to: ingredient._id,
        });
      }
      else {
        return false;
      }

    },
  },

  deleteCocktail: {
    type: gql.GraphQLBoolean,
    description: 'Deletes an existing cocktail. Note that this will remove any existing relationships with this node.',
    args: {
      id: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'The id of the cocktail.',
      },
    },
    resolve(value, {id}) {
      const cocktail = dbDriver.cocktailItems.exists(id);
      if (cocktail) {
        return dbDriver.cocktailItems.remove(cocktail._id);
      }
      else {
        throw new gql.GraphQLError({
          message: `The id ${id} does not currently exist.`,
        });
      }
    },
  },

};
