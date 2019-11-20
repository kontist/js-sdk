import { ResultPage } from "./resultPage";
import { Model } from "./model";
import { FetchOptions } from "./types";

export abstract class IterableModel<T> extends Model<T> {
  createAsyncIterator(args?: FetchOptions) {
    const fetch = this.fetch.bind(this);
    let lastResult!: ResultPage<T>;

    return {
      next: async () => {
        // this is the first call or items are empty
        if (!lastResult) {
          lastResult = await fetch(args);
        }

        if (lastResult.items.length === 0 && lastResult.pageInfo.hasNextPage) {
          lastResult = await fetch({
            ...args,
            after: lastResult.pageInfo.endCursor
          });
        }

        // return the items as long as there are some
        if (lastResult.items.length > 0) {
          return {
            done: false,
            value: lastResult.items.pop()
          };
        }

        // no more data
        return { value: undefined, done: true };
      }
    };
  }

  [Symbol.asyncIterator]() {
    return this.createAsyncIterator();
  }

  fetchAll(args?: FetchOptions) {
    const asyncIterator = this.createAsyncIterator(args);
    return {
      [Symbol.asyncIterator]() {
        return asyncIterator;
      }
    };
  }
}
