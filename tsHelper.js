'use strict';

module.exports = {
  watchDirs: {
    graphqlClass: {
      path: 'app/graphql',
      interface: 'IGraphqlClass',
      pattern: '**/(model|connector)*.(ts|js)',
      generator: 'class',
      caseStyle: 'lower',
      trigger: [ 'add', 'unlink' ],
      enabled: true,
    },
  },
};
