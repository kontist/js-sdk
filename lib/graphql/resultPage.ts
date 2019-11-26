import { PageInfo } from "./schema";
import { IFetch } from "./interfaces";
import { FetchOptions } from "./types";

export class ResultPage<ModelType, FetchOptionsType = FetchOptions> {
  items: Array<ModelType>;
  pageInfo: PageInfo;
  nextPage?: () => Promise<ResultPage<ModelType, FetchOptionsType>>;
  previousPage?: () => Promise<ResultPage<ModelType, FetchOptionsType>>;

  constructor(
    model: IFetch<ModelType, FetchOptionsType>,
    items: Array<ModelType>,
    pageInfo: PageInfo,
    args: FetchOptionsType
  ) {
    this.items = items;
    this.pageInfo = pageInfo;

    if (pageInfo.hasNextPage) {
      this.nextPage = () =>
        model.fetch({ ...args, after: pageInfo.endCursor });
    }

    if (pageInfo.hasPreviousPage) {
      this.previousPage = () =>
        model.fetch({
          ...args,
          before: pageInfo.startCursor
        });
    }
  }
}
