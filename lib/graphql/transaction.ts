import { IterableModel } from "./iterableModel";
import { ResultPage } from "./resultPage";
import {
  AccountTransactionsArgs,
  BaseOperator,
  MutationCategorizeTransactionArgs,
  MutationUpdateTransactionArgs,
  MutationCreateTransactionSplitsArgs,
  MutationDeleteTransactionSplitsArgs,
  MutationUpdateTransactionSplitsArgs,
  MutationCreateTransactionAssetArgs,
  MutationFinaliseTransactionAssetArgs,
  MutationDeleteTransactionAssetArgs,
  Query,
  Transaction as TransactionModel,
  TransactionFilter,
  TransactionsConnectionEdge,
} from "./schema";
import { FetchOptions, Subscription, SubscriptionType } from "./types";

const MAX_SEARCH_QUERY_LENGTH = 200;
const MAX_SEARCH_AMOUNT_IN_CENTS = 2000000000;

type PositiveAmountFilter = {
  amount_gte: number;
  amount_lt: number;
}

type NegativeAmountFilter = {
  amount_lte: number;
  amount_gt: number;
}

type AmountBetweenFilter = {
  operator: BaseOperator.And;
} & PositiveAmountFilter | NegativeAmountFilter;

type AmountSearchFilter = {
  amount_in: number[];
  conditions: AmountBetweenFilter[];
};

const ASSET_FIELDS = `
  id
  name
  filetype
  thumbnail
  fullsize
`;

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
  personalNote
  purpose
  documentNumber
  documentPreviewUrl
  documentDownloadUrl
  documentType
  createdAt
  splits {
    id
    amount
    category
    userSelectedBookingDate
  }
  assets {
    ${ASSET_FIELDS}
  }
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

export const UPDATE_TRANSACTION = `mutation updateTransaction(
  $id: String!
  $category: TransactionCategory,
  $userSelectedBookingDate: DateTime,
  $personalNote: String,
) {
  updateTransaction(
    id: $id
    category: $category
    userSelectedBookingDate: $userSelectedBookingDate
    personalNote: $personalNote
  ) {
    ${TRANSACTION_FIELDS}
  }
}`;

export const CREATE_SPLIT_TRANSACTION = `mutation createTransactionSplits(
  $transactionId: ID!
  $splits: [CreateTransactionSplitsInput!]!
) {
  createTransactionSplits(
    transactionId: $transactionId
    splits: $splits
  ) {
    ${TRANSACTION_FIELDS}
  }
}`;

export const DELETE_SPLIT_TRANSACTION = `mutation deleteTransactionSplits(
  $transactionId: ID!
) {
  deleteTransactionSplits(
    transactionId: $transactionId
  ) {
    ${TRANSACTION_FIELDS}
  }
}`;

export const UPDATE_SPLIT_TRANSACTION = `mutation updateTransactionSplits(
  $transactionId: ID!
  $splits: [UpdateTransactionSplitsInput!]!
) {
  updateTransactionSplits(
    transactionId: $transactionId
    splits: $splits
  ) {
    ${TRANSACTION_FIELDS}
  }
}`;

export const CREATE_TRANSACTION_ASSET = `mutation createTransactionAsset(
  $transactionId: ID!
  $name: String!
  $filetype: String!
) {
  createTransactionAsset(
    transactionId: $transactionId
    name: $name
    filetype: $filetype
  ) {
    assetId
    url
    formData {
      key
      value
    }
  }
}`;

export const FINALISE_TRANSACTION_ASSET = `mutation finaliseTransactionAssetUpload(
  $assetId: ID!
) {
  finaliseTransactionAssetUpload(
    assetId: $assetId
  ) {
    ${ASSET_FIELDS}
  }
}`;

export const DELETE_TRANSACTION_ASSET = `mutation deleteTransactionAsset(
  $assetId: ID!
) {
  deleteTransactionAsset(
    assetId: $assetId
  ) {
    successs
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
   * @deprecated   This method will be removed in an upcoming release.
   *               Use `transaction.update` method instead.
   *
   * @param args   query parameters including category and userSelectedBookingDate
   * @returns      the transaction with updated categorization data
   */
  public async categorize(args: MutationCategorizeTransactionArgs) {
    const result = await this.client.rawQuery(CATEGORIZE_TRANSACTION, args);
    return result.categorizeTransaction;
  }

  /**
   * Updates a transaction
   *
   * @param args   query parameters including category, userSelectedBookingDate and personalNote
   * @returns      the transaction with updated categorization data and updated personalNote
   */
  public async update(args: MutationUpdateTransactionArgs) {
    const result = await this.client.rawQuery(UPDATE_TRANSACTION, args);
    return result.updateTransaction;
  }

  /**
   * Creates transaction splits
   *
   * @param args   transaction ID and split data
   * @returns      the transaction with created split data
   */
  public async createSplit(args: MutationCreateTransactionSplitsArgs) {
    const result = await this.client.rawQuery(CREATE_SPLIT_TRANSACTION, args);
    return result.createTransactionSplits;
  }

  /**
   * Removes transaction splits
   *
   * @param args   transaction ID
   * @returns      the transaction with emptied split data
   */
  public async deleteSplit(args: MutationDeleteTransactionSplitsArgs) {
    const result = await this.client.rawQuery(DELETE_SPLIT_TRANSACTION, args);
    return result.deleteTransactionSplits;
  }

  /**
   * Updates transaction splits
   *
   * @param args   transaction ID and split data including the splits' IDs
   * @returns      the transaction with updated split data
   */
  public async updateSplit(args: MutationUpdateTransactionSplitsArgs) {
    const result = await this.client.rawQuery(UPDATE_SPLIT_TRANSACTION, args);
    return result.updateTransactionSplits;
  }

  /**
   * Creates upload parameters for uploading a TransactionAsset file
   *
   * @param args   transaction ID, name, and filetype
   * @returns      the required data to upload a file
   */
  public async createTransactionAsset(args: MutationCreateTransactionAssetArgs) {
    const result = await this.client.rawQuery(CREATE_TRANSACTION_ASSET, args);
    return result.createTransactionAsset;
  }

  /**
   * Verifies and marks a TransactionAsset file as ready
   *
   * @param args   asset ID
   * @returns      the finalised TransactionAsset information
   */
  public async finaliseTransactionAssetUpload(args: MutationFinaliseTransactionAssetArgs) {
    const result = await this.client.rawQuery(FINALISE_TRANSACTION_ASSET, args);
    return result.finaliseTransactionAssetUpload;
  }

  /**
   * Deletes a TransactionAsset
   *
   * @param args   asset ID
   * @returns      the finalised TransactionAsset information
   */
  public async deleteTransactionAsset(args: MutationDeleteTransactionAssetArgs) {
    const result = await this.client.rawQuery(DELETE_TRANSACTION_ASSET, args);
    return result.deleteTransactionAsset;
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
