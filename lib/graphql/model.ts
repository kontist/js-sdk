import { GraphQLClient } from "./client";

export class Model {
  protected client: GraphQLClient;

  constructor(graphqlClient: GraphQLClient) {
    this.client = graphqlClient;
  }

  async fetchAll(): Promise<Array<Object>> {
    throw new Error("Must be overridden by subclasses!");
  }
}
