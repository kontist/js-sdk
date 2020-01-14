import {
  Query,
  TransactionsConnectionEdge,
  Transaction as TransactionModel,
  MutationCategorizeTransactionArgs
} from "./schema";
import { IterableModel } from "./iterableModel";
import { FetchOptions, SubscriptionType, Subscription } from "./types";
import { ResultPage } from "./resultPage";

const TRANSACTION_FIELDS = `
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
`;

const FETCH_TRANSACTIONS = `query fetchTransactions ($first: Int, $last: Int, $after: String, $before: String) {
  viewer {
    mainAccount {
      transactions(first: $first, last: $last, after: $after, before: $before) {
        edges {
          node {
            ${TRANSACTION_FIELDS}
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

export const NEW_TRANSACTION_SUBSCRIPTION = `subscription {
  newTransaction {
    ${TRANSACTION_FIELDS}
  }
}`;

export const CATEGORIZE_TRANSACTION = `mutation categorizeTransaction(
  $id: String!
  $category: TransactionCategory,
  $userSelectedBookingDate: DateTime
) {
  categorizeTransaction(
    id: $id
    category: $category
    userSelectedBookingDate: $userSelectedBookingDate
  ) {
    ${TRANSACTION_FIELDS}
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

    const transactions = (
      result?.viewer?.mainAccount?.transactions?.edges ?? []
    ).map((edge: TransactionsConnectionEdge) => edge.node);

    const pageInfo = result?.viewer?.mainAccount?.transactions?.pageInfo ?? {
      hasNextPage: false,
      hasPreviousPage: false
    };
    return new ResultPage(this, transactions, pageInfo, args);
  }

  /**
   * @inheritdoc
   */
  fetchAll(args?: FetchOptions) {
    return super.fetchAll(args ?? {});
  }

  subscribe(
    onNext: (event: TransactionModel) => any,
    onError?: (error: Error) => any
  ): Subscription {
    return this.client.subscribe({
      query: NEW_TRANSACTION_SUBSCRIPTION,
      type: SubscriptionType.newTransaction,
      onNext,
      onError
    });
  }

  /**
   * Categorizes a transaction
   *
   * @param args   query parameters including category and userSelectedBookingDate
   * @returns      the transaction with updated categorization data
   */
  async categorize(args: MutationCategorizeTransactionArgs) {
    const result = await this.client.rawQuery(CATEGORIZE_TRANSACTION, args);
    return result.categorizeTransaction;
  }
}
