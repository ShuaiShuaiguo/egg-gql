// const is = require('is-type-of');
const is = require('is-type-of');
const { SchemaDirectiveVisitor } = require('graphql-tools');
const { BaseContextClass } = require('egg');
const { merge } = require('lodash');

exports.isGraphqlClass = obj => {
  const prototype = Object.getPrototypeOf(obj);
  return is.class(obj) && prototype === BaseContextClass;
};

exports.isResolver = obj => {
  if (is.object(obj)) {
    let isResolver = true;
    const keys = Object.keys(obj);
    for (const key of keys) {
      isResolver = is.object(obj[key]);
      break;
    }
    return isResolver;
  } else {
    return false;
  }
};

exports.initDirectives = (obj, opt, schemaDirectives, directiveResolvers) => {
  if (isDirective(obj)) {
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
 */
exports.initTypeDefs = (obj, typeDefs) => {
  if (isGraphqlSchema(obj)) {
    if (!is.function(obj)) {
      obj = () => (is.array(obj) ? obj : [obj]);
    }
    typeDefs = typeDefs.push(obj);
  }
};

exports.initResolvers = (obj, resolvers) => {
  if (isResolver(obj)) {
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
