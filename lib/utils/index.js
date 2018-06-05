'use strict';

const is = require('is-type-of');
const { SchemaDirectiveVisitor } = require('graphql-tools');
const { BaseContextClass } = require('egg');
const { merge } = require('lodash');

/**
 *
 * @param {Object} obj js module exports
 * @return {boolean} whether it is bound to context.
 */
exports.isGraphqlClass = obj => {
  const prototype = Object.getPrototypeOf(obj);
  return is.class(obj) && prototype === BaseContextClass;
};

/**
 *
 * @param {Object} obj js module exports
 * @return {boolean} Is it graphql schema resolver?
 */
exports.isResolver = obj => {
  if (is.object(obj)) {
    let isResolver = true;
    const keys = Object.keys(obj);
    for (const key of keys) {
      isResolver = is.object(obj[key]);
      break;
    }
    return isResolver;
  }
  return false;
};

/**
 *
 * @param {Object} obj grapqhl js module exports
 * @param {Object} opt module file info {fullPath, pathName}
 * @param {Object} schemaDirectives the function makeExecutableSchema schemaDirectives param
 * @param {Object} directiveResolvers the function makeExecutableSchema directiveResolvers param
 */
exports.initDirectives = (obj, opt, schemaDirectives, directiveResolvers) => {
  if (this.isDirective(obj)) {
    const directive = opt.pathName.split('.').pop();
    if (is.class(obj)) {
      schemaDirectives[directive] = obj;
    } else {
      merge(directiveResolvers, obj);
    }
  }
};
/**
 * @link https://www.apollographql.com/docs/graphql-tools/generate-schema.html#modularizing
 *
 * If you’re exporting array of schema strings and there are circular dependencies,
 * the array can be wrapped in a function. The makeExecutableSchema function will only
 * include each type definition once, even if it is imported multiple times by different types,
 *  so you don’t have to worry about deduplicating the strings.
 *
 * init typeDefs
 * @param {Object} obj js module exports
 * @param {Array | string | function} typeDefs type defs
 */
exports.initTypeDefs = (obj, typeDefs) => {
  if (this.isGraphqlSchema(obj)) {
    if (!is.function(obj)) {
      obj = () => (is.array(obj) ? obj : [ obj ]);
    }
    typeDefs.push(obj);
  }
};

exports.initResolvers = (obj, resolvers) => {
  if (this.isResolver(obj)) {
    merge(resolvers, obj);
  }
};

exports.isGraphqlSchema = obj => {
  if (is.class(obj)) {
    return false;
  }
  return is.function(obj) || is.string(obj) || is.array(obj);
};

exports.isDirective = obj => {
  let isDirectiveResolver = false;
  if (is.object(obj)) {
    const keys = Object.keys(obj);
    for (const key of keys) {
      isDirectiveResolver = is.function(obj[key]);
      break;
    }
  }

  const prototype = Object.getPrototypeOf(obj);
  const isDirectiveClass =
    is.class(obj) && prototype === SchemaDirectiveVisitor;
  return isDirectiveResolver || isDirectiveClass;
};
