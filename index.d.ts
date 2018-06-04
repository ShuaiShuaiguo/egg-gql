import { GraphQLSchema } from 'graphql';
import { PlainObject, BaseContextClass } from 'egg';

export class Connector extends BaseContextClass {}
export class Model extends BaseContextClass {}

declare module 'egg' {
  export interface IGraphqlClass extends PlainObject {
    [key: string]: Connector | Model;
  }

  interface Aplication {
    schema: GraphQLSchema;
  }
  interface Context {
    graphql: IGraphqlClass;
  }
}
