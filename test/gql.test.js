'use strict';

const mock = require('egg-mock');

describe('test/gql.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/gql-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, graphql')
      .expect(200);
  });
});
