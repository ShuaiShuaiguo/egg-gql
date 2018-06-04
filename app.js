const graphqlLoader = require('./lib/loader/graphql-loader.js');

module.exports = app => {
  // 加载graphql
  graphqlLoader(app).load();
};
