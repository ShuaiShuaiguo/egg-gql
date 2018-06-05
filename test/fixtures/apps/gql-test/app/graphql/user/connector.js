'use strict';

const DataLoader = require('dataloader');
const { Connector } = require('../../../../../../../index');

class UserConnector extends Connector {
  constructor(ctx) {
    super(ctx);
    this.loader = new DataLoader(this.fetch.bind(this));
  }
  fetch(ids) {
    return Promise.resolve(
      ids.map(id => ({
        id,
        firstName: `firstName${id}`,
        lastName: `lastName${id}`,
        upperName: `name${id}`,
        comments: []
      }))
    );
  }

  fetchById(id) {
    return this.loader.load(id);
  }
}

module.exports = UserConnector;
