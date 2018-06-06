'use strict';

const { SchemaDirectiveVisitor } = require('graphql-tools');
const { GraphQLString } = require('graphql');
const moment = require('moment');

class FormatDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { defaultFormat } = this.args;
    field.args.push({
      name: 'format',
      type: GraphQLString
    });
    field.resolve = async function(source, args) {
      const theDay = moment(source.createAt);
      return theDay.format(args.format || defaultFormat);
    };
    field.type = GraphQLString;
  }
}

module.exports = FormatDateDirective;
