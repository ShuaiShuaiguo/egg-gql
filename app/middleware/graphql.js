'use strict';

const { graphiqlKoa, graphqlKoa } = require('apollo-server-koa');
/**
 * @param {object} config 中间件的配置项，app.config[${middlewareName}]
 * @return {function} koa middleware
 */
module.exports = config => {
  const { router, graphiql = true, onPreGraphiQL, onPreGraphQL } = config;

  return async (ctx, next) => {
    if (ctx.path === router) {
      if (ctx.request.accepts(['json', 'html']) === 'html' && graphiql) {
        if (onPreGraphiQL) {
          await onPreGraphiQL(ctx);
        }
        return graphiqlKoa({
          endpointURL: router
        })(ctx);
      }

      if (onPreGraphQL) {
        await onPreGraphQL(ctx);
      }
      return graphqlKoa({
        schema: ctx.app.schema,
        context: ctx
      })(ctx);
    }
    await next();
  };
};
