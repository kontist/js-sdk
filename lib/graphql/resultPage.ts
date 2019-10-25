import { PageInfo } from "./schema";
import { IFetch } from "./interfaces";

export class ResultPage {
  items: Array<Object>;
  nextPage?: () => Promise<ResultPage>;
  previousPage?: () => Promise<ResultPage>;

  constructor(model: IFetch, items: Array<Object>, pageInfo: PageInfo) {
    this.items = items;

    if (pageInfo.hasNextPage) {
      this.nextPage = () => model.fetchAll({ after: pageInfo.endCursor });
    }

    if (pageInfo.hasPreviousPage) {
      this.previousPage = () =>
        model.fetchAll({ before: pageInfo.startCursor });
    }
  }
}
