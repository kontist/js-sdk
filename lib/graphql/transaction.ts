import { get } from "lodash";
import {
  Query,
  TransactionsConnectionEdge,
  Transaction as TransactionEntry
} from "./schema";
import { Model } from "./model";
import { FetchOptions } from "./types";
import { ResultPage } from "./resultPage";

export class Transaction extends Model<TransactionEntry> {
  /**
   * Fetches first 50 transactions which match the query
   *
   * @param args  query parameters
   * @returns     result page
   */
  async fetch(args?: FetchOptions): Promise<ResultPage<TransactionEntry>> {
    const query = `
      query fetchTransactions ($first: Int, $last: Int, $after: String, $before: String) {
        viewer {
          mainAccount {
            transactions(first: $first, last: $last, after: $after, before: $before) {
              edges {
                node {
                    id
                    amount
                    name
                    iban
                    type
                    bookingDate
                    valutaDate
                    originalAmount
                    foreignCurrency
                    e2eId
                    mandateNumber
                    paymentMethod
                    category
                    userSelectedBookingDate
                    purpose
                    documentNumber
                    documentPreviewUrl
                    documentDownloadUrl
                    documentType
                }
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
            }
          }
        }
    }`;
    const result: Query = await this.client.rawQuery(query, args);

    const transactions = get(
      result,
      "viewer.mainAccount.transactions.edges",
      []
    ).map((edge: TransactionsConnectionEdge) => edge.node);

    const pageInfo = get(result, "viewer.mainAccount.transactions.pageInfo");
    return new ResultPage(this, transactions, pageInfo);
  }

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
