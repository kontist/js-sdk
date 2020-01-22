import { IFetch } from "./interfaces";
import { PageInfo } from "./schema";
import { FetchOptions } from "./types";

export class ResultPage<ModelType, FetchOptionsType = FetchOptions> {
  public items: ModelType[];
  public pageInfo: PageInfo;
  public nextPage?: () => Promise<ResultPage<ModelType, FetchOptionsType>>;
  public previousPage?: () => Promise<ResultPage<ModelType, FetchOptionsType>>;

  constructor(
    model: IFetch<ModelType, FetchOptionsType>,
    items: ModelType[],
    pageInfo: PageInfo,
    args: FetchOptionsType,
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
          before: pageInfo.startCursor,
        });
    }
  }
}
