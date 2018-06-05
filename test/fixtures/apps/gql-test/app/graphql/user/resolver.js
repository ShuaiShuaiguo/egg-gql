'use strict';

module.exports = {
  Query: {
    user(root, { id }, ctx) {
      return ctx.graphql.user.mode.getById(id);
    },
  },
};
