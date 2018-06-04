const {
  execute,
  formatError,
  ExecutionResult,
  GraphQLFormattedError
} = require('graphql');
const gql = require('graphql-tag');
const { Service } = require('egg');

class GraphqlService extends Service {
  async query(requestString) {
    let result = {};
    try {
      const { query, variables, operationName } = JSON.parse(requestString);
      const documentAST = gql`
        ${query}
      `;
      const schema = this.app.schema,
        context = this.ctx;
      result = await execute(
        schema,
        documentAST,
        null,
        context,
        variables,
        operationName
      );
      if (result && result.errors) {
        result.formatErrors = result.errors.map(formatError);
      }
    } catch (e) {
      this.logger.error(e);

      result = {
        data: {},
        errors: [e]
      };
    }

    return result;
  }
}

module.exports = GraphqlService;
