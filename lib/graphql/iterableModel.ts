import { ResultPage } from "./resultPage";
import { Model } from "./model";

export abstract class IterableModel<T> extends Model<T> {
  [Symbol.asyncIterator]() {
    let lastResult!: ResultPage<T>;

    return {
      next: async (args: Object = {}) => {
        // this is the first call or items are empty
        if (!lastResult) {
          lastResult = await this.fetch(args);
        }

        if (lastResult.items.length === 0 && lastResult.pageInfo.hasNextPage) {
          lastResult = await this.fetch({
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
}
