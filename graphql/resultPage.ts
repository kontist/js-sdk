import { IFetch } from "./interfaces";
import { PageInfo } from "./schema";
import { FetchOptions } from "./types";

export class ResultPage<
  ModelType,
  FetchOptionsType = FetchOptions,
  RestArgs extends any[] = any[],
> {
  public items: ModelType[];
  public pageInfo: PageInfo;
  public nextPage?: () => Promise<
    ResultPage<ModelType, FetchOptionsType, RestArgs>
  >;
  public previousPage?: () => Promise<
    ResultPage<ModelType, FetchOptionsType, RestArgs>
  >;

  constructor(
    model: IFetch<ModelType, FetchOptionsType, RestArgs>,
    items: ModelType[],
    pageInfo: PageInfo,
    args: FetchOptionsType,
    ...rest: RestArgs
  ) {
    this.items = items;
    this.pageInfo = pageInfo;

    if (pageInfo.hasNextPage) {
      this.nextPage = () =>
        model.fetch({ ...args, after: pageInfo.endCursor }, ...rest);
    }

    if (pageInfo.hasPreviousPage) {
      this.previousPage = () =>
        model.fetch(
          {
            ...args,
            before: pageInfo.startCursor,
          },
          ...rest
        );
    }
  }
}
