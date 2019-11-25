import { PageInfo } from "./schema";

export interface IResultPageInterface<T> {
  items: Array<T>;
  pageInfo: PageInfo;
  nextPage?: () => Promise<IResultPageInterface<T>>;
  previousPage?: () => Promise<IResultPageInterface<T>>;
}

export interface IFetch<ModelType, FetchOptionsType> {
  fetch(args?: FetchOptionsType): Promise<IResultPageInterface<ModelType>>;
}
