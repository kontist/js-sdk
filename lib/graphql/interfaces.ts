import { FetchOptions } from "./types";

export interface IResultPageInterface<T> {
  items: Array<T>;
  nextPage?: () => Promise<IResultPageInterface<T>>;
  previousPage?: () => Promise<IResultPageInterface<T>>;
}

export interface IFetch<T> {
  fetch(args?: FetchOptions): Promise<IResultPageInterface<T>>;
}
