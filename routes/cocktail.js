'use strict';
const dd = require('dedent');
const joi = require('joi');
const httpError = require('http-errors');
const status = require('statuses');
const errors = require('@arangodb').errors;
const createRouter = require('@arangodb/foxx/router');
const Cocktail = require('../models/cocktail');

const cocktailItems = module.context.collection('cocktail');
const keySchema = joi.string().required()
.description('The key of the cocktail');

const ARANGO_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
const ARANGO_DUPLICATE = errors.ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED.code;
const ARANGO_CONFLICT = errors.ERROR_ARANGO_CONFLICT.code;
const HTTP_NOT_FOUND = status('not found');
const HTTP_CONFLICT = status('conflict');

const router = createRouter();
module.exports = router;


router.get(function (req, res) {
  res.send(cocktailItems.all());
}, 'list')
.response([Cocktail], 'A list of cocktailItems.')
.summary('List all cocktailItems')
.description(dd`
  Retrieves a list of all cocktailItems.
`);


router.post(function (req, res) {
  const cocktail = req.body;
  let meta;
  try {
    meta = cocktailItems.save(cocktail);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_DUPLICATE) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  Object.assign(cocktail, meta);
  res.status(201);
  res.set('location', req.makeAbsolute(
    req.reverse('detail', {key: cocktail._key})
  ));
  res.send(cocktail);
}, 'create')
.body(Cocktail, 'The cocktail to create.')
.response(201, Cocktail, 'The created cocktail.')
.error(HTTP_CONFLICT, 'The cocktail already exists.')
.summary('Create a new cocktail')
.description(dd`
  Creates a new cocktail from the request body and
  returns the saved document.
`);


router.get(':key', function (req, res) {
  const key = req.pathParams.key;
  let cocktail;
  try {
    cocktail = cocktailItems.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
  res.send(cocktail);
}, 'detail')
.pathParam('key', keySchema)
.response(Cocktail, 'The cocktail.')
.summary('Fetch a cocktail')
.description(dd`
  Retrieves a cocktail by its key.
`);


router.put(':key', function (req, res) {
  const key = req.pathParams.key;
  const cocktail = req.body;
  let meta;
  try {
    meta = cocktailItems.replace(key, cocktail);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  Object.assign(cocktail, meta);
  res.send(cocktail);
}, 'replace')
.pathParam('key', keySchema)
.body(Cocktail, 'The data to replace the cocktail with.')
.response(Cocktail, 'The new cocktail.')
.summary('Replace a cocktail')
.description(dd`
  Replaces an existing cocktail with the request body and
  returns the new document.
`);


router.patch(':key', function (req, res) {
  const key = req.pathParams.key;
  const patchData = req.body;
  let cocktail;
  try {
    cocktailItems.update(key, patchData);
    cocktail = cocktailItems.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  res.send(cocktail);
}, 'update')
.pathParam('key', keySchema)
.body(joi.object().description('The data to update the cocktail with.'))
.response(Cocktail, 'The updated cocktail.')
.summary('Update a cocktail')
.description(dd`
  Patches a cocktail with the request body and
  returns the updated document.
`);


router.delete(':key', function (req) {
  const key = req.pathParams.key;
  try {
    cocktailItems.remove(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
}, 'delete')
.pathParam('key', keySchema)
.response(null)
.summary('Remove a cocktail')
.description(dd`
  Deletes a cocktail from the database.
`);
