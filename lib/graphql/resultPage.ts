import { PageInfo } from "./schema";
import { IFetch } from "./interfaces";
import { FetchOptions } from "./types";

export class ResultPage<T> {
  items: Array<T>;
  pageInfo: PageInfo;
  nextPage?: () => Promise<ResultPage<T>>;
  previousPage?: () => Promise<ResultPage<T>>;

  constructor(
    model: IFetch<T>,
    items: Array<T>,
    pageInfo: PageInfo,
    args: FetchOptions = {}
  ) {
    this.items = items;
    this.pageInfo = pageInfo;

    if (pageInfo.hasNextPage) {
      this.nextPage = () => model.fetch({ ...args, after: pageInfo.endCursor });
    }

    if (pageInfo.hasPreviousPage) {
      this.previousPage = () =>
        model.fetch({ ...args, before: pageInfo.startCursor });
    }
  }
}
