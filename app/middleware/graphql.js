const { graphiqlKoa, graphqlKoa } = require('apollo-server-koa');
const { Application, Context } = require('egg');
/**
 * @param config 中间件的配置项，app.config[${middlewareName}]
 * @param app 当前应用 Application 的实例。
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
        schema: app.schema
      });
    }
    await next();
  };
};
