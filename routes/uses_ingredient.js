'use strict';
const dd = require('dedent');
const joi = require('joi');
const httpError = require('http-errors');
const status = require('statuses');
const errors = require('@arangodb').errors;
const createRouter = require('@arangodb/foxx/router');
const Uses_ingredient = require('../models/uses_ingredient');

const uses_ingredientItems = module.context.collection('uses_ingredient');
const keySchema = joi.string().required()
.description('The key of the uses_ingredient');

const ARANGO_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
const ARANGO_DUPLICATE = errors.ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED.code;
const ARANGO_CONFLICT = errors.ERROR_ARANGO_CONFLICT.code;
const HTTP_NOT_FOUND = status('not found');
const HTTP_CONFLICT = status('conflict');

const router = createRouter();
module.exports = router;

const NewUses_ingredient = Object.assign({}, Uses_ingredient, {
  schema: Object.assign({}, Uses_ingredient.schema, {
    _from: joi.string(),
    _to: joi.string()
  })
});


router.get(function (req, res) {
  res.send(uses_ingredientItems.all());
}, 'list')
.response([Uses_ingredient], 'A list of uses_ingredientItems.')
.summary('List all uses_ingredientItems')
.description(dd`
  Retrieves a list of all uses_ingredientItems.
`);


router.post(function (req, res) {
  const uses_ingredient = req.body;
  let meta;
  try {
    meta = uses_ingredientItems.save(uses_ingredient._from, uses_ingredient._to, uses_ingredient);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_DUPLICATE) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  Object.assign(uses_ingredient, meta);
  res.status(201);
  res.set('location', req.makeAbsolute(
    req.reverse('detail', {key: uses_ingredient._key})
  ));
  res.send(uses_ingredient);
}, 'create')
.body(NewUses_ingredient, 'The uses_ingredient to create.')
.response(201, Uses_ingredient, 'The created uses_ingredient.')
.error(HTTP_CONFLICT, 'The uses_ingredient already exists.')
.summary('Create a new uses_ingredient')
.description(dd`
  Creates a new uses_ingredient from the request body and
  returns the saved document.
`);


router.get(':key', function (req, res) {
  const key = req.pathParams.key;
  let uses_ingredient;
  try {
    uses_ingredient = uses_ingredientItems.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
  res.send(uses_ingredient);
}, 'detail')
.pathParam('key', keySchema)
.response(Uses_ingredient, 'The uses_ingredient.')
.summary('Fetch a uses_ingredient')
.description(dd`
  Retrieves a uses_ingredient by its key.
`);


router.put(':key', function (req, res) {
  const key = req.pathParams.key;
  const uses_ingredient = req.body;
  let meta;
  try {
    meta = uses_ingredientItems.replace(key, uses_ingredient);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  Object.assign(uses_ingredient, meta);
  res.send(uses_ingredient);
}, 'replace')
.pathParam('key', keySchema)
.body(Uses_ingredient, 'The data to replace the uses_ingredient with.')
.response(Uses_ingredient, 'The new uses_ingredient.')
.summary('Replace a uses_ingredient')
.description(dd`
  Replaces an existing uses_ingredient with the request body and
  returns the new document.
`);


router.patch(':key', function (req, res) {
  const key = req.pathParams.key;
  const patchData = req.body;
  let uses_ingredient;
  try {
    uses_ingredientItems.update(key, patchData);
    uses_ingredient = uses_ingredientItems.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  res.send(uses_ingredient);
}, 'update')
.pathParam('key', keySchema)
.body(joi.object().description('The data to update the uses_ingredient with.'))
.response(Uses_ingredient, 'The updated uses_ingredient.')
.summary('Update a uses_ingredient')
.description(dd`
  Patches a uses_ingredient with the request body and
  returns the updated document.
`);


router.delete(':key', function (req) {
  const key = req.pathParams.key;
  try {
    uses_ingredientItems.remove(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
}, 'delete')
.pathParam('key', keySchema)
.response(null)
.summary('Remove a uses_ingredient')
.description(dd`
  Deletes a uses_ingredient from the database.
`);
