'use strict';

const { Model } = require('../../../../../../../index');

class UserModel extends Model {
  getById(id) {
    this.ctx.graphql.user.connector.fetchById(id);
  }
}

module.exports = UserModel;
