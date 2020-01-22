import { GraphQLClient } from "./client";
import { IFetch } from "./interfaces";
import { ResultPage } from "./resultPage";
import { FetchOptions } from "./types";

export abstract class Model<ModelType, FetchOptionsType = FetchOptions>
  implements IFetch<ModelType, FetchOptionsType> {
  protected client: GraphQLClient;

  constructor(graphqlClient: GraphQLClient) {
    this.client = graphqlClient;
  }

  public abstract async fetch(
    args?: FetchOptionsType,
  ): Promise<ResultPage<ModelType, FetchOptionsType>>;
}
