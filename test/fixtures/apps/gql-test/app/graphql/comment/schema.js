'use strict';

module.exports = () => [ Comment, User ];

const User = require('../user/schema');

const Comment = `
  type Comment {
    id: Int!
    message: String,
    author: User
  }
`;
