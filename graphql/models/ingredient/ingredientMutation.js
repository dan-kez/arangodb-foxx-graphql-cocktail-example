const gql = require('graphql-sync');
const ingredientSchema = require('./ingredientSchema');

const dbDriver = require('../../../database/driver');

module.exports = {

  createIngredient: {
    type: ingredientSchema.Ingredient,
    description: 'Create new ingredient',
    args: {
      newIngredient: {
        type: new gql.GraphQLNonNull(ingredientSchema.CreateIngredientInput)
      },
    },
    resolve(value, {newIngredient}) {
      return dbDriver.ingredientItems.save(newIngredient);
    },
  },

  deleteIngredient: {
    type: gql.GraphQLBoolean,
    description: 'Deletes an existing ingredient. Note that this will remove any existing relationships with this node.',
    args: {
      id: {
        type: new gql.GraphQLNonNull(gql.GraphQLString),
        description: 'The id of the ingredient.',
      },
    },
    resolve(value, {id}) {
      const ingredient = dbDriver.ingredientItems.exists(id);
      if (ingredient) {
        return dbDriver.ingredientItems.remove(ingredient._id);
      }
      else {
        throw new gql.GraphQLError({
          message: `The id ${id} does not currently exist.`,
        });
      }
    },
  },
};
