'use strict';

module.exports = () => [User, Comment];

const Comment = require('../comment/schema');

const User = `
  type Query {
    user(id: Int): User
  }

  type User {
    id: Int!
    firstName: String
    lastName: String 
    comments: [Comment]
    upperName: String @upper
    createAt: Date @date
  }
`;
