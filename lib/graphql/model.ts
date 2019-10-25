import { GraphQLClient } from "./client";
import { ResultPage } from "./resultPage";
import { FetchOptions } from "./types";
import { IFetch } from "./interfaces";

export class Model<T> implements IFetch<T> {
  protected client: GraphQLClient;

  constructor(graphqlClient: GraphQLClient) {
    this.client = graphqlClient;
  }

  async fetch(args?: FetchOptions): Promise<ResultPage<T>> {
    throw new Error("Must be overridden by subclasses!");
  }
}
