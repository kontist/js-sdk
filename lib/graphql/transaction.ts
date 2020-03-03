import { IterableModel } from "./iterableModel";
import { ResultPage } from "./resultPage";
import {
  AccountTransactionsArgs,
  BaseOperator,
  MutationCategorizeTransactionArgs,
  Query,
  Transaction as TransactionModel,
  TransactionFilter,
  TransactionsConnectionEdge,
} from "./schema";
import { FetchOptions, Subscription, SubscriptionType } from "./types";

const MAX_SEARCH_QUERY_LENGTH = 200;
const MAX_SEARCH_AMOUNT_IN_CENTS = 2000000000;

type AmountBetweenFilter = {
  operator: BaseOperator;
  amount_gte?: number;
  amount_lte?: number;
  amount_lt?: number;
  amount_gt?: number;
}

type AmountSearchFilter = {
  amount_in: number[];
  conditions: AmountBetweenFilter[];
};

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

const FETCH_TRANSACTIONS = `
  query fetchTransactions ($first: Int, $last: Int, $after: String, $before: String, $filter: TransactionFilter) {
    viewer {
      mainAccount {
        transactions(first: $first, last: $last, after: $after, before: $before, filter: $filter) {
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
  }
`;

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
  public async fetch(args?: AccountTransactionsArgs): Promise<ResultPage<TransactionModel>> {
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
   * Fetches up to first 50 matching transactions for a given user input
   * It will consider case insensitive like matches for amount,
   * iban, description, and name
   *
   * @param searchQuery  input query from user
   * @returns
   */
  public async search(searchQuery: string): Promise<ResultPage<TransactionModel>> {
    const filter = this.parseSearchQuery(searchQuery);
    return this.fetch({ filter });
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

  private parseAmountSearchTerm(amountTerm: string): AmountSearchFilter {
    const shouldMatchWildCents = !/[,.]/.test(amountTerm);
    const amountInCents = Math.round(
      parseFloat(amountTerm.replace(",", ".")) * 100
    );

    if (amountInCents > MAX_SEARCH_AMOUNT_IN_CENTS) {
      return { amount_in: [], conditions: [] };
    }

    const invertedAmountInCents = amountInCents * -1;
    const positiveAmountInCents = amountInCents > 0 ? amountInCents : invertedAmountInCents;
    const negativeAmountInCents = amountInCents > 0 ? invertedAmountInCents : amountInCents;

    return {
      amount_in: [amountInCents, invertedAmountInCents],
      conditions: shouldMatchWildCents
        ? [
            {
              operator: BaseOperator.And,
              amount_gte: positiveAmountInCents,
              amount_lt: positiveAmountInCents + 100
            },
            {
              operator: BaseOperator.And,
              amount_gt: negativeAmountInCents - 100,
              amount_lte: negativeAmountInCents
            }
          ]
        : []
    };
  }

  private parseSearchQuery(searchQuery: string): TransactionFilter {
    const searchTerms = searchQuery
      .slice(0, MAX_SEARCH_QUERY_LENGTH)
      .split(" ")
      .filter(term => term.length > 0);

    const filter: TransactionFilter = {
      name_likeAny: searchTerms,
      operator: BaseOperator.Or,
      purpose_likeAny: searchTerms
    };

    const amountRegex = /^-?\d+([,.]\d{1,2})?$/;
    const amountFilter = searchTerms
      .filter(term => amountRegex.test(term))
      .reduce(
        (
          partialAmountFilter: AmountSearchFilter,
          term: string
        ): AmountSearchFilter => {
          const parsedAmountSearchTerm = this.parseAmountSearchTerm(term);

          return {
            amount_in: [
              ...partialAmountFilter.amount_in,
              ...parsedAmountSearchTerm.amount_in
            ],
            conditions: [
              ...partialAmountFilter.conditions,
              ...parsedAmountSearchTerm.conditions
            ]
          };
        },
        { amount_in: [], conditions: [] }
      );

    if (amountFilter.amount_in.length > 0) {
      filter.amount_in = amountFilter.amount_in;
    }

    if (amountFilter.conditions.length > 0) {
      filter.conditions = amountFilter.conditions;
    }

    const ibanRegex = /^[A-Za-z]{2}\d{2,36}$/;
    const ibanTerms = searchTerms.filter(term => ibanRegex.test(term));

    if (ibanTerms.length > 0) {
      filter.iban_likeAny = ibanTerms;
    }

    return filter;
  }
}
