'use strict';

const assert = require('assert');
const eggMock = require('egg-mock');

describe('test/app/service.test.js', () => {
  let app;

  before(() => {
    app = eggMock.app({
      baseDir: 'apps/gql-test',
      plugin: 'graphql'
    });
    return app.ready();
  });

  after(eggMock.restore);

  it('should return empty comment', async () => {
    const ctx = app.mockContext();
    const query = JSON.stringify({
      query: '{comments}'
    });

    const res = await ctx.service.graphql.query(query);

    assert.deepEqual(res.data.comments, []);
  });
});
