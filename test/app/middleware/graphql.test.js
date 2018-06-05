'use strict';

const assert = require('assert');
const eggMock = require('egg-mock');

describe('test/app/middleware.test.js', () => {
  let app;

  before(() => {
    app = eggMock.app({
      baseDir: 'apps/gql-test',
      plugin: 'graphql'
    });
    return app.ready();
  });

  after(eggMock.restore);

  it('should return user 1', async () => {
    const res = await app
      .httpRequest()
      .get('/graphql?query=query {user(id: 1){lastName}}')
      .expect(200);
    assert.deepEqual(res.body.data, {
      user: {
        lastName: 'lastName1'
      }
    });
  });

  it('should return user 2', async () => {
    const res = await app
      .httpRequest()
      .get('/user')
      .expect(200);
    assert.deepEqual(res.body.data, {
      user: {
        lastName: 'lastName2'
      }
    });
  });
});
