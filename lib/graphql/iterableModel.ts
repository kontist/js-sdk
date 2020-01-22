import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { FetchOptions } from "./types";

export abstract class IterableModel<
  ModelType,
  FetchOptionsType = FetchOptions
> extends Model<ModelType, FetchOptionsType> {
  public createAsyncIterator(args: FetchOptionsType) {
    const fetch = this.fetch.bind(this);
    let lastResult!: ResultPage<ModelType, FetchOptionsType>;

    return {
      next: async () => {
        // this is the first call or items are empty
        if (!lastResult) {
          lastResult = await fetch(args);
        }

        if (lastResult.items.length === 0 && lastResult.pageInfo.hasNextPage) {
          lastResult = await fetch({
            ...args,
            after: lastResult.pageInfo.endCursor,
          });
        }

        // return the items as long as there are some
        if (lastResult.items.length > 0) {
          return {
            done: false,
            value: lastResult.items.shift(),
          };
        }

        // no more data
        return { value: undefined, done: true };
      },
    };
  }

  public fetchAll(args: FetchOptionsType) {
    const asyncIterator = this.createAsyncIterator(args);
    return {
      [Symbol.asyncIterator]() {
        return asyncIterator;
      },
    };
  }
}
