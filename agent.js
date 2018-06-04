'use strict';

const graphqlLoader = require('./lib/loader/graphql-loader.js');

module.exports = agent => {
  // 加载graphql
  graphqlLoader(agent).load();
};
