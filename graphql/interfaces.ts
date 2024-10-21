import { PageInfo } from "./schema";
import { FetchOptions } from "./types";

export interface IResultPageInterface<
  T,
  FetchOptionsType = FetchOptions,
  RestArgs extends any[] = any[],
> {
  items: T[];
  pageInfo: PageInfo;
  nextPage?: () => Promise<IResultPageInterface<T, FetchOptionsType, RestArgs>>;
  previousPage?: () => Promise<
    IResultPageInterface<T, FetchOptionsType, RestArgs>
  >;
}

export interface IFetch<
  ModelType,
  FetchOptionsType,
  RestArgs extends any[] = any[],
> {
  fetch(
    args?: FetchOptionsType,
    ...rest: RestArgs
  ): Promise<IResultPageInterface<ModelType, FetchOptionsType, RestArgs>>;
}
