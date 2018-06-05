'use strict';

const is = require('is-type-of');
const { SchemaDirectiveVisitor } = require('graphql-tools');
const { BaseContextClass } = require('egg');
/**
 *
 * @param {Object} obj js module exports
 * @return {boolean} whether it is bound to context.
 */
exports.isContextGraphqlClass = obj => {
  const prototype = Object.getPrototypeOf(obj);
  return is.class(obj) && prototype === BaseContextClass;
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
  if (!is.function(obj)) {
    obj = () => (is.array(obj) ? obj : [obj]);
  }
  typeDefs.push(obj);
};

exports.isSchemaDirective = obj => {
  const prototype = Object.getPrototypeOf(obj);
  return prototype === SchemaDirectiveVisitor;
};

/**
 * Get exports type.
 * @param {Object} obj grpahql file exports
 * @return {int} type types
 */
exports.getType = obj => {
  let type = this.types.resolver;
  if (is.object(obj)) {
    let isResolver = true,
      isDirectiveResolver = true,
      isSchema = true;
    const keys = Object.keys(obj);
    for (const key of keys) {
      if (!is.function(obj[key])) {
        isDirectiveResolver = false;
      }
      if (!is.object(obj[key])) {
        isResolver = false;
      }
    }
    isSchema = !isDirectiveResolver && !isResolver;
    if (isDirectiveResolver) {
      type = this.types.directiveResolver;
    }
    if (isSchema) {
      type = this.types.schema;
    }
  }
  if (is.class(obj)) {
    if (this.isSchemaDirective(obj)) {
      type = this.types.schemaDirectiveVisitor;
    }
    if (this.isContextGraphqlClass(obj)) {
      type = this.types.contextGraphqlClass;
    }
  }
  if ((is.function(obj) && !is.class(obj)) || is.string(obj) || is.array(obj)) {
    type = this.types.schema;
  }
  return type;
};

exports.types = {
  resolver: 0,
  directiveResolver: 1,
  schema: 2,
  contextGraphqlClass: 3,
  schemaDirectiveVisitor: 4
};
