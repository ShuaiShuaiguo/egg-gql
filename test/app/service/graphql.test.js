'use strict';

// const assert = require('assert');
const eggMock = require('egg-mock');

describe('test/app/service.test.js', () => {
  let app;

  before(() => {
    app = eggMock.app({
      baseDir: 'apps/gql-test',
    });
    return app.ready();
  });

  after(eggMock.restore);
});
