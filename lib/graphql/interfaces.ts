import { FetchOptions } from "./types";
import { PageInfo } from "./schema";

export interface IResultPageInterface<T> {
  items: Array<T>;
  pageInfo: PageInfo;
  nextPage?: () => Promise<IResultPageInterface<T>>;
  previousPage?: () => Promise<IResultPageInterface<T>>;
}

export interface IFetch<T> {
  fetch(args?: FetchOptions): Promise<IResultPageInterface<T>>;
}
