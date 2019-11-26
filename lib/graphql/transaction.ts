import {
  Query,
  TransactionsConnectionEdge,
  Transaction as TransactionModel
} from "./schema";
import { IterableModel } from "./iterableModel";
import { ResultPage } from "./resultPage";
import { FetchOptions } from "./types";

const FETCH_TRANSACTIONS = `query fetchTransactions ($first: Int, $last: Int, $after: String, $before: String) {
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

export class Transaction extends IterableModel<TransactionModel> {
  /**
   * Fetches first 50 transactions which match the query
   *
   * @param args  query parameters
   * @returns     result page
   */
  async fetch(args?: FetchOptions): Promise<ResultPage<TransactionModel>> {
    const result: Query = await this.client.rawQuery(FETCH_TRANSACTIONS, args);

    const transactions = (result?.viewer?.mainAccount?.transactions?.edges ?? []).map((edge: TransactionsConnectionEdge) => edge.node);

    const pageInfo = result?.viewer?.mainAccount?.transactions?.pageInfo ?? { hasNextPage: false, hasPreviousPage: false};
    return new ResultPage(this, transactions, pageInfo, args);
  }

  /**
   * @inheritdoc
   */
  fetchAll(args?: FetchOptions) {
    return super.fetchAll(args ?? {});
  }
}
