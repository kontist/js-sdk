import { GraphQLClient } from "./client";
import { ResultPage } from "./resultPage";
import { IFetch } from "./interfaces";
import { FetchOptions } from "./types";
export declare abstract class Model<ModelType, FetchOptionsType = FetchOptions> implements IFetch<ModelType, FetchOptionsType> {
    protected client: GraphQLClient;
    constructor(graphqlClient: GraphQLClient);
    abstract fetch(args?: FetchOptionsType): Promise<ResultPage<ModelType, FetchOptionsType>>;
}
