import { FetchOptions } from "./types";

export interface IResultPageInterface {
  items: Array<Object>;
  nextPage?: () => Promise<IResultPageInterface>;
  previousPage?: () => Promise<IResultPageInterface>;
}

export interface IFetch {
  fetchAll(args?: FetchOptions): Promise<IResultPageInterface>;
}
