'use strict';

const assert = require('assert');
const eggMock = require('egg-mock');

describe('test/app/middleware.test.js', () => {
  let app;

  before(() => {
    app = eggMock.app({
      baseDir: 'apps/gql-test',
      plugin: 'graphql',
    });
    return app.ready();
  });

  after(eggMock.restore);

  it('should return user 1', async () => {
    const res = await app
      .httpRequest()
      .get(
        '/graphql?query=query+getUser($id:Int){user(id:$id){name}}&variables={"id":1}'
      )
      .expect(200);

    assert.deepEqual(res.body.data, {
      user: {
        name: 'name1',
      },
    });
  });
});
