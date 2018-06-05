'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);

  router.get('/user', async ctx => {
    const req = {
      query: `{
        user(id: 2) {
          lastName
        }
      }`
    };
    ctx.body = await ctx.service.graphql.query(JSON.stringify(req));
  });
};
