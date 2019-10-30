import { get } from "lodash";
import {
  Query,
  TransactionsConnectionEdge,
  Transaction as TransactionEntry
} from "./schema";
import { IterableModel } from "./iterableModel";
import { FetchOptions } from "./types";
import { ResultPage } from "./resultPage";

export class Transaction extends IterableModel<TransactionEntry> {
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
}
