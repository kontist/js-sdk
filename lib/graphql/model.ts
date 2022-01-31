import { FetchOptions } from "./types";
import { GraphQLClient } from "./client";
import { IFetch } from "./interfaces";
import { ResultPage } from "./resultPage";

export abstract class Model<ModelType, FetchOptionsType = FetchOptions>
  implements IFetch<ModelType, FetchOptionsType> {
  protected client: GraphQLClient;

  constructor(graphqlClient: GraphQLClient) {
    this.client = graphqlClient;
  }

  public abstract fetch(
    args?: FetchOptionsType,
  ): Promise<ResultPage<ModelType, FetchOptionsType>>;
}
