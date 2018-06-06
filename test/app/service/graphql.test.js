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

  it('should return user with no comments', async () => {
    const ctx = app.mockContext();
    const query = JSON.stringify({
      query: '{ user(id: 3) { comments } }'
    });
    const resp = await ctx.service.graphql.query(query);
    assert.deepEqual(resp.data, { user: { comments: [] } });
  });

  it('should return error', async () => {
    const ctx = app.mockContext();
    const resp = await ctx.service.graphql.query('');
    assert.deepEqual(resp.data, {});
    assert.equal(resp.errors[0].message, 'Unexpected end of JSON input');
  });

  it("should return name's upperCase with @upper directive", async () => {
    const ctx = app.mockContext();
    const resp = await ctx.service.graphql.query(
      JSON.stringify({
        query: '{ user(id: 1) { upperName } }'
      })
    );
    assert.deepEqual(resp.data, { user: { upperName: 'NAME1' } });
  });
  it('should return createAt with @date directive', async () => {
    const ctx = app.mockContext();
    const resp = await ctx.service.graphql.query(
      JSON.stringify({
        query: '{ user(id: 1) { createAt } }'
      })
    );
    assert.deepEqual(resp.data, { user: { createAt: '2018-6-6' } });
  });
});
