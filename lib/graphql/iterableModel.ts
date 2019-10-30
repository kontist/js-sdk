import { ResultPage } from "./resultPage";
import { Model } from "./model";

export abstract class IterableModel<T> extends Model<T> {
  private lastResult!: ResultPage<T>;

  [Symbol.asyncIterator]() {
    return {
      next: async (args: Object = {}) => {
        // this is the first call or items are empty
        if (!this.lastResult) {
          this.lastResult = await this.fetch(args);
        }

        if (
          this.lastResult.items.length === 0 &&
          this.lastResult.pageInfo.hasNextPage
        ) {
          this.lastResult = await this.fetch({
            ...args,
            after: this.lastResult.pageInfo.endCursor
          });
        }

        // return the items as long as there are some
        if (this.lastResult.items.length > 0) {
          return {
            done: false,
            value: this.lastResult.items.pop()
          };
        }

        // no more data
        return { value: undefined, done: true };
      }
    };
  }
}
