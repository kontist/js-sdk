import { PageInfo } from "./schema";
import { IFetch } from "./interfaces";

export class ResultPage<T> {
  items: Array<T>;
  pageInfo: PageInfo;
  nextPage?: () => Promise<ResultPage<T>>;
  previousPage?: () => Promise<ResultPage<T>>;

  constructor(model: IFetch<T>, items: Array<T>, pageInfo: PageInfo) {
    this.items = items;
    this.pageInfo = pageInfo;

    if (pageInfo.hasNextPage) {
      this.nextPage = () => model.fetch({ after: pageInfo.endCursor });
    }

    if (pageInfo.hasPreviousPage) {
      this.previousPage = () => model.fetch({ before: pageInfo.startCursor });
    }
  }
}
