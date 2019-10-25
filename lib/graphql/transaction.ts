import { get } from "lodash";
import {
  Query,
  Transaction as TransactionEntry,
  TransactionsConnectionEdge
} from "./schema";
import { Model } from "./model";
import { FetchOptions } from "./types";
import { ResultPage } from "./resultPage";

const safeGet = (source: any, path: any, defaultValue: any) =>
  get(source, path, defaultValue) || defaultValue;

export class Transaction extends Model<TransactionEntry> {
  async fetch(args?: FetchOptions): Promise<ResultPage<TransactionEntry>> {
    const query = `
      query fetchTransactions ($first: Int, $last: Int, $after: String, $before: String) {
        viewer {
          mainAccount {
            transactions(first: $first, last:$last, after: $after, before: $before) {
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

    const transactions = safeGet(
      result,
      "viewer.mainAccount.transactions.edges",
      []
    ).map((edge: TransactionsConnectionEdge) => edge.node);

    const pageInfo = get(result, "viewer.mainAccount.transactions.pageInfo");
    return new ResultPage(this, transactions, pageInfo);
  }
}
