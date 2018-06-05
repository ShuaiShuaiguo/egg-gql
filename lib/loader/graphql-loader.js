'use strict';

const { join } = require('path');
const {
  isGraphqlClass,
  initDirectives,
  initTypeDefs,
  initResolvers
} = require('../utils');
const { makeExecutableSchema } = require('graphql-tools');

const SYMBOL_SCHEMA = Symbol('Application#schema');

module.exports = app => {
  //  the old directiveResolvers API
  const directiveResolvers = {};
  //  new directive implemention
  const schemaDirectives = {};
  // graphql resolvers
  const resolvers = {};
  // graphql schema
  const typeDefs = [];

  class GraphqlLoader {
    constructor(app) {
      this.app = app;
    }

    load(opt) {
      const loader = this.app.loader;
      loader.timing.start('Loader Graphql');
      opt = Object.assign(
        {
          caseStyle: 'lower',
          directory: join(this.app.baseDir, 'app/graphql'),
          fieldClass: 'graphqlClasses',
          filter: obj => isGraphqlClass(obj),
          initializer: (obj, opt) => {
            initTypeDefs(obj, typeDefs);
            initResolvers(obj, resolvers);
            initDirectives(obj, opt, schemaDirectives, directiveResolvers);
            return obj;
          }
        },
        opt
      );
      const baseDir = opt.directory;
      loader.loadToContext(baseDir, 'graphql', opt);
      loader.timing.end('Loader Graphql');

      /**
       * create a GraphQL.js GraphQLSchema instance
       */
      Object.defineProperty(this.app, 'schema', {
        get() {
          if (!this[SYMBOL_SCHEMA]) {
            this[SYMBOL_SCHEMA] = makeExecutableSchema({
              typeDefs,
              resolvers,
              directiveResolvers,
              schemaDirectives
            });
          }
          return this[SYMBOL_SCHEMA];
        }
      });
    }
  }

  return new GraphqlLoader(app);
};
