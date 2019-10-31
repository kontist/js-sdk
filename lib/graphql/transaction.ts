import get = require("lodash/get");
import {
  Query,
  TransactionsConnectionEdge,
  Transaction as TransactionEntry
} from "./schema";
import { IterableModel } from "./iterableModel";
import { FetchOptions } from "./types";
import { ResultPage } from "./resultPage";
import { FETCH_TRANSACTIONS } from "./queries";

export class Transaction extends IterableModel<TransactionEntry> {
  /**
   * Fetches first 50 transactions which match the query
   *
   * @param args  query parameters
   * @returns     result page
   */
  async fetch(args?: FetchOptions): Promise<ResultPage<TransactionEntry>> {
    const result: Query = await this.client.rawQuery(FETCH_TRANSACTIONS, args);

    const transactions = get(
      result,
      "viewer.mainAccount.transactions.edges",
      []
    ).map((edge: TransactionsConnectionEdge) => edge.node);

    const pageInfo = get(result, "viewer.mainAccount.transactions.pageInfo");
    return new ResultPage(this, transactions, pageInfo);
  }
}
