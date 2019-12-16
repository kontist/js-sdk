import { PageInfo } from "./schema";
import { IFetch } from "./interfaces";
import { FetchOptions } from "./types";
export declare class ResultPage<ModelType, FetchOptionsType = FetchOptions> {
    items: Array<ModelType>;
    pageInfo: PageInfo;
    nextPage?: () => Promise<ResultPage<ModelType, FetchOptionsType>>;
    previousPage?: () => Promise<ResultPage<ModelType, FetchOptionsType>>;
    constructor(model: IFetch<ModelType, FetchOptionsType>, items: Array<ModelType>, pageInfo: PageInfo, args: FetchOptionsType);
}
