'use strict';

const { join } = require('path');
const {
  isContextGraphqlClass,
  initTypeDefs,
  types,
  getType
} = require('../utils');
const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');
const is = require('is-type-of');

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
          filter: obj => isContextGraphqlClass(obj),
          initializer: (obj, opt) => {
            const type = getType(obj);
            if (type !== types.contextGraphqlClass) {
              this.initSchema(obj, type, opt);
            }
            return obj;
          }
        },
        opt
      );
      const baseDir = opt.directory;
      loader.loadToContext(baseDir, 'graphql', opt);
      loader.timing.end('Loader Graphql');

      // load graphql.schema
      this.loadGraphqlSchema();
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

    initSchema(obj, type, opt) {
      if (type === types.resolver) {
        merge(resolvers, obj);
      }
      if (type === types.directiveResolver) {
        merge(directiveResolvers, obj);
      }
      if (type === types.schemaDirectiveVisitor) {
        const directive = opt.pathName.split('.').pop();
        schemaDirectives[directive] = obj;
      }
      if (type === types.schema) {
        if (is.object(obj)) {
          const keys = Object.keys(obj);
          for (const key of keys) {
            if (is.object(obj[key])) {
              merge(resolvers, obj[key]);
            } else {
              initTypeDefs(obj[key], typeDefs);
            }
          }
        }
        initTypeDefs(obj, typeDefs);
      }
    }

    loadGraphqlSchema(opt) {
      opt = {
        directory: join(this.app.baseDir, 'app/graphql'),
        match: '**/*.graphql',
        target: {},
        initializer: obj => {
          typeDefs.push(obj.toString());
        }
      };
      new this.app.loader.FileLoader(opt).load();
    }
  }

  return new GraphqlLoader(app);
};
