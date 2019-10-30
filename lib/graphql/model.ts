import { GraphQLClient } from "./client";
import { ResultPage } from "./resultPage";
import { FetchOptions } from "./types";
import { IFetch } from "./interfaces";

export abstract class Model<T> implements IFetch<T> {
  protected client: GraphQLClient;
  protected lastResult!: ResultPage<T>;

  constructor(graphqlClient: GraphQLClient) {
    this.client = graphqlClient;
  }

  abstract async fetch(args?: FetchOptions): Promise<ResultPage<T>>;
}
