import { GraphQLClient } from "./client";
import { ResultPage } from "./resultPage";
import { IFetch } from "./interfaces";
import { FetchOptions } from "./types";

export abstract class Model<ModelType, FetchOptionsType = FetchOptions>
  implements IFetch<ModelType, FetchOptionsType> {
  protected client: GraphQLClient;

  constructor(graphqlClient: GraphQLClient) {
    this.client = graphqlClient;
  }

  abstract async fetch(
    args?: FetchOptionsType
  ): Promise<ResultPage<ModelType, FetchOptionsType>>;
}
