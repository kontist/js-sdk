import { IterableModel } from "./iterableModel";
import { ResultPage } from "./resultPage";
import {
  MutationCategorizeTransactionArgs,
  Query,
  Transaction as TransactionModel,
  TransactionsConnectionEdge,
} from "./schema";
import { FetchOptions, Subscription, SubscriptionType } from "./types";

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
  public async fetch(args?: FetchOptions): Promise<ResultPage<TransactionModel>> {
    const result: Query = await this.client.rawQuery(FETCH_TRANSACTIONS, args);

    const transactions = (
      result?.viewer?.mainAccount?.transactions?.edges ?? []
    ).map((edge: TransactionsConnectionEdge) => edge.node);

    const pageInfo = result?.viewer?.mainAccount?.transactions?.pageInfo ?? {
      hasNextPage: false,
      hasPreviousPage: false,
    };
    return new ResultPage(this, transactions, pageInfo, args);
  }

  /**
   * @inheritdoc
   */
  public fetchAll(args?: FetchOptions) {
    return super.fetchAll(args ?? {});
  }

  public subscribe(
    onNext: (event: TransactionModel) => any,
    onError?: (error: Error) => any,
  ): Subscription {
    return this.client.subscribe({
      onError,
      onNext,
      query: NEW_TRANSACTION_SUBSCRIPTION,
      type: SubscriptionType.newTransaction,
    });
  }

  /**
   * Categorizes a transaction
   *
   * @param args   query parameters including category and userSelectedBookingDate
   * @returns      the transaction with updated categorization data
   */
  public async categorize(args: MutationCategorizeTransactionArgs) {
    const result = await this.client.rawQuery(CATEGORIZE_TRANSACTION, args);
    return result.categorizeTransaction;
  }
}
