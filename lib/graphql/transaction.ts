import { IterableModel } from "./iterableModel";
import { ResultPage } from "./resultPage";
import {
  AccountTransactionsArgs,
  AccountTransactionArgs,
  BaseOperator,
  MutationUpdateTransactionArgs,
  MutationCreateTransactionSplitsArgs,
  MutationDeleteTransactionSplitsArgs,
  MutationUpdateTransactionSplitsArgs,
  MutationCreateTransactionAssetArgs,
  MutationFinalizeTransactionAssetUploadArgs,
  MutationDeleteTransactionAssetArgs,
  Query,
  Transaction as TransactionModel,
  TransactionFilter,
  TransactionsConnectionEdge,
  AccountTransactionsCsvArgs,
  FilterPresetInput,
  GenericFilterPreset,
  MissingTaxAssetsFilterPreset,
} from "./schema";
import {
  FetchOptions,
  Subscription,
  SubscriptionType,
  SearchFilter,
} from "./types";

const MAX_SEARCH_QUERY_LENGTH = 200;
const MAX_SEARCH_AMOUNT_IN_CENTS = 2000000000;

type PositiveAmountFilter = {
  amount_gte: number;
  amount_lt: number;
};

type NegativeAmountFilter = {
  amount_lte: number;
  amount_gt: number;
};

type AmountBetweenFilter =
  | ({
      operator: BaseOperator.And;
    } & PositiveAmountFilter)
  | NegativeAmountFilter;

type AmountSearchFilter = {
  amount_in: number[];
  conditions: AmountBetweenFilter[];
};

export enum TransactionFetchVersion {
  V1 = "V1",
  V2 = "V2",
}

const ASSET_FIELDS = `
  id
  name
  filetype
  thumbnail
  fullsize
`;

export const TRANSACTION_FIELDS = `
  id
  amount
  name
  iban
  type
  bookingDate
  valutaDate
  paymentMethod
  category
  categoryCode
  vatCategoryCode
  vatRate
  categorizationType
  userSelectedBookingDate
  purpose
  personalNote
  originalAmount
  foreignCurrency
  createdAt
  splits {
    id
    amount
    category
    categoryCode
    userSelectedBookingDate
    categorizationType
    vatCategoryCode
  }
  recurlyInvoiceNumber
  canBeRecategorized
`;

export const TRANSACTION_LIST_FIELDS = `
id
amount
name
purpose
bookingDate
createdAt
category
userSelectedBookingDate
type
splits {
  id
  amount
  category
  userSelectedBookingDate
}`.trim();

const TRANSACTION_DETAILS = `
  assets {
    ${ASSET_FIELDS}
  }
  documentNumber
  documentPreviewUrl
  documentDownloadUrl
  documentType
  mandateNumber
`;

const getFetchTransactionsQuery = (
  fields: string,
  version = TransactionFetchVersion.V1
) => {
  switch (version) {
    case TransactionFetchVersion.V1:
      if (!fields) {
        fields = TRANSACTION_FIELDS;
      }

      return `
query FetchTransactions${version} (
  $first: Int,
  $last: Int,
  $after: String,
  $before: String,
  $filter: TransactionFilter,
  $preset: FilterPresetInput,
  $publicId: String
) {
    viewer {
      mainAccount {
        ${
          version === TransactionFetchVersion.V1
            ? "transactions"
            : "transactionsV2"
        }
        (
          first: $first,
          last: $last,
          after: $after,
          before: $before,
          filter: $filter,
          preset: $preset,
          publicId: $publicId
        ) {
          edges {
            node {
              ${fields}
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

    case TransactionFetchVersion.V2:
      if (!fields) {
        fields = TRANSACTION_LIST_FIELDS;
      }

      return `
query AccountTransactionsQuery (
  $first: Int,
  $last: Int,
  $after: String,
  $before: String,
  $filter: TransactionFilter,
  $publicId: String
) {
  transactions(
    first: $first,
    last: $last,
    after: $after,
    before: $before,
    filter: $filter,
    publicId: $publicId
  ) {
    edges {
      node {
        ${fields}
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}`;
  }
};

const getFetchTransactionQuery = (fields: string) => `
  query fetchTransaction ($id: ID!) {
    viewer {
      mainAccount {
        transaction(id: $id) {
          ${fields}
        }
      }
    }
  }
`;

export const NEW_TRANSACTION_SUBSCRIPTION = `subscription {
  newTransaction {
    ${TRANSACTION_FIELDS}
    ${TRANSACTION_DETAILS}
  }
}`;

export const getUpdateTransactionMutation = (
  fields: string
) => `mutation updateTransaction(
  $id: String!
  $category: TransactionCategory,
  $userSelectedBookingDate: DateTime,
  $personalNote: String,
  $vatRate: VatRate,
  $categoryCode: String,
  $vatCategoryCode: String,
  $splits: [TransactionSplitInput!],
  $businessAssetInput: BusinessAssetInput
) {
  updateTransaction(
    id: $id
    category: $category
    userSelectedBookingDate: $userSelectedBookingDate
    personalNote: $personalNote
    vatRate: $vatRate
    categoryCode: $categoryCode
    vatCategoryCode: $vatCategoryCode
    splits: $splits
    businessAssetInput: $businessAssetInput
  ) {
    ${fields}
  }
}`;

const DEFAULT_SPLIT_TRANSACTION_FIELDS = `
${TRANSACTION_FIELDS}
${TRANSACTION_DETAILS}
`;

export const getCreateSplitTransactionMutation = (
  fields = DEFAULT_SPLIT_TRANSACTION_FIELDS
) => `mutation createTransactionSplits(
  $transactionId: ID!
  $splits: [CreateTransactionSplitsInput!]!
) {
  createTransactionSplits(
    transactionId: $transactionId
    splits: $splits
  ) {
    ${fields}
  }
}`;

export const getDeleteSplitTransactionMutation = (
  fields = DEFAULT_SPLIT_TRANSACTION_FIELDS
) => `mutation deleteTransactionSplits(
  $transactionId: ID!
) {
  deleteTransactionSplits(
    transactionId: $transactionId
  ) {
    ${fields}
  }
}`;

export const getUpdateSplitTransactionMutation = (
  fields = DEFAULT_SPLIT_TRANSACTION_FIELDS
) => `mutation updateTransactionSplits(
  $transactionId: ID!
  $splits: [UpdateTransactionSplitsInput!]!
) {
  updateTransactionSplits(
    transactionId: $transactionId
    splits: $splits
  ) {
    ${fields}
  }
}`;

export const CREATE_TRANSACTION_ASSET = `mutation createTransactionAsset(
  $transactionId: ID!
  $name: String!
  $filetype: String!
  $assetableType: String
  $uploadPlatform: RequestPlatform
) {
  createTransactionAsset(
    transactionId: $transactionId
    name: $name
    filetype: $filetype
    assetableType: $assetableType
    uploadPlatform: $uploadPlatform
  ) {
    assetId
    url
    formData {
      key
      value
    }
  }
}`;

export const FINALIZE_TRANSACTION_ASSET = `mutation finalizeTransactionAssetUpload(
  $assetId: ID!
) {
  finalizeTransactionAssetUpload(
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
    success
  }
}`;

const FETCH_TRANSACTIONS_CSV = `
  query fetchTransactionsCSV ($from: DateTime, $to: DateTime) {
    viewer {
      mainAccount {
        transactionsCSV(from: $from, to: $to)
      }
    }
  }
`;

const FETCH_TRANSACTION_FILTER_PRESETS = `
  query fetchTransactionFilterPresets {
    viewer {
      mainAccount {
        transactionFilterPresets {
          __typename
          value

          ... on MissingTaxAssetsFilterPreset {
            year
          }
        }
      }
    }
  }
`;

export class Transaction extends IterableModel<TransactionModel> {
  /**
   * Fetches transactions which match the query
   *
   * @param args  query parameters
   * @param fields  optional custom transaction fields
   * @param version  optional transaction fetch version (default: V1)
   * @returns     result page
   */
  public async fetch(
    args?: AccountTransactionsArgs,
    fields = "",
    version: TransactionFetchVersion = TransactionFetchVersion.V1
  ): Promise<ResultPage<TransactionModel>> {
    const result: Query = await this.client.rawQuery(
      getFetchTransactionsQuery(fields, version),
      args
    );

    const resultTransactions =
      version === TransactionFetchVersion.V1
        ? result.viewer?.mainAccount?.transactions
        : result.transactions;

    const transactions = (resultTransactions?.edges ?? []).map(
      (edge: TransactionsConnectionEdge) => edge.node
    );

    const pageInfo = resultTransactions?.pageInfo ?? {
      hasNextPage: false,
      hasPreviousPage: false,
    };
    return new ResultPage(this, transactions, pageInfo, args, fields, version);
  }

  /**
   * Fetches up to first 50 matching transactions for a given user input
   * It will consider case insensitive like matches for amount,
   * iban, description, and name
   *
   * @param searchQuery  input query
   * @param searchQuery  optional input filter
   * @param searchQuery  optional transaction preset
   * @param fields  optional custom transaction fields
   * @returns
   */
  public async search(
    searchQuery: string,
    searchFilter?: SearchFilter,
    preset?: FilterPresetInput,
    fields?: string,
    publicId?: string,
    version = TransactionFetchVersion.V1
  ): Promise<ResultPage<TransactionModel>> {
    const filter = this.parseSearchQuery(searchQuery, searchFilter);
    return this.fetch({ filter, preset, publicId }, fields, version);
  }

  /**
   * @inheritdoc
   */
  public fetchAll(args?: FetchOptions) {
    return super.fetchAll(args ?? {});
  }

  /**
   * Fetches the transaction with the provided ID
   * By default, all transaction fields will be included in the result
   *
   * @param args  transaction ID
   * @param fields  optional custom transaction fields
   * @returns     Transaction
   */
  public async fetchOne(
    args: AccountTransactionArgs,
    fields = `${TRANSACTION_FIELDS}
              ${TRANSACTION_DETAILS}`
  ) {
    const result: Query = await this.client.rawQuery(
      getFetchTransactionQuery(fields),
      args
    );

    return result.viewer?.mainAccount?.transaction;
  }

  public subscribe(
    onNext: (event: TransactionModel) => any,
    onError?: (error: Error) => any
  ): Subscription {
    return this.client.subscribe({
      onError,
      onNext,
      query: NEW_TRANSACTION_SUBSCRIPTION,
      type: SubscriptionType.newTransaction,
    });
  }

  /**
   * Updates a transaction
   *
   * @param args   query parameters including category, userSelectedBookingDate and personalNote
   * @param fields  optional custom transaction fields
   * @returns      the transaction with updated categorization data and updated personalNote
   */
  public async update(
    args: MutationUpdateTransactionArgs,
    fields = `${TRANSACTION_FIELDS}
  ${TRANSACTION_DETAILS}`
  ) {
    const result = await this.client.rawQuery(
      getUpdateTransactionMutation(fields),
      args
    );
    return result.updateTransaction;
  }

  /**
   * Creates transaction splits
   *
   * @param args   transaction ID and split data
   * @param fields  optional custom transaction fields
   * @returns      the transaction with created split data
   */
  public async createSplit(
    args: MutationCreateTransactionSplitsArgs,
    fields?: string
  ) {
    const result = await this.client.rawQuery(
      getCreateSplitTransactionMutation(fields),
      args
    );
    return result.createTransactionSplits;
  }

  /**
   * Removes transaction splits
   *
   * @param args   transaction ID
   * @param fields  optional custom transaction fields
   * @returns      the transaction with emptied split data
   */
  public async deleteSplit(
    args: MutationDeleteTransactionSplitsArgs,
    fields?: string
  ) {
    const result = await this.client.rawQuery(
      getDeleteSplitTransactionMutation(fields),
      args
    );
    return result.deleteTransactionSplits;
  }

  /**
   * Updates transaction splits
   *
   * @param args   transaction ID and split data including the splits' IDs
   * @param fields  optional custom transaction fields
   * @returns      the transaction with updated split data
   */
  public async updateSplit(
    args: MutationUpdateTransactionSplitsArgs,
    fields?: string
  ) {
    const result = await this.client.rawQuery(
      getUpdateSplitTransactionMutation(fields),
      args
    );
    return result.updateTransactionSplits;
  }

  /**
   * Creates upload parameters for uploading a TransactionAsset file
   *
   * @param args   transaction ID, name, and filetype
   * @returns      the required data to upload a file
   */
  public async createTransactionAsset(
    args: MutationCreateTransactionAssetArgs
  ) {
    const result = await this.client.rawQuery(CREATE_TRANSACTION_ASSET, args);
    return result.createTransactionAsset;
  }

  /**
   * Verifies and marks a TransactionAsset file as ready
   *
   * @param args   asset ID
   * @returns      the finalized TransactionAsset information
   */
  public async finalizeTransactionAssetUpload(
    args: MutationFinalizeTransactionAssetUploadArgs
  ) {
    const result = await this.client.rawQuery(FINALIZE_TRANSACTION_ASSET, args);
    return result.finalizeTransactionAssetUpload;
  }

  /**
   * Deletes a TransactionAsset
   *
   * @param args   asset ID
   * @returns      a MutationResult
   */
  public async deleteTransactionAsset(
    args: MutationDeleteTransactionAssetArgs
  ) {
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
    const positiveAmountInCents =
      amountInCents > 0 ? amountInCents : invertedAmountInCents;
    const negativeAmountInCents =
      amountInCents > 0 ? invertedAmountInCents : amountInCents;

    return {
      amount_in: [amountInCents, invertedAmountInCents],
      conditions: shouldMatchWildCents
        ? [
            {
              operator: BaseOperator.And,
              amount_gte: positiveAmountInCents,
              amount_lt: positiveAmountInCents + 100,
            },
            {
              operator: BaseOperator.And,
              amount_gt: negativeAmountInCents - 100,
              amount_lte: negativeAmountInCents,
            },
          ]
        : [],
    };
  }

  private parseSearchQuery(
    searchQuery: string,
    searchFilter?: SearchFilter
  ): TransactionFilter {
    if (!searchQuery && searchFilter) {
      return searchFilter;
    }

    const searchTerms = searchQuery
      .slice(0, MAX_SEARCH_QUERY_LENGTH)
      .split(" ")
      .filter((term) => term.length > 0);

    const filter: TransactionFilter = {
      name_likeAny: searchTerms,
      operator: BaseOperator.Or,
      purpose_likeAny: searchTerms,
    };

    const amountRegex = /^-?\d+([,.]\d{1,2})?$/;
    const amountFilter = searchTerms
      .filter((term) => amountRegex.test(term))
      .reduce(
        (
          partialAmountFilter: AmountSearchFilter,
          term: string
        ): AmountSearchFilter => {
          const parsedAmountSearchTerm = this.parseAmountSearchTerm(term);

          return {
            amount_in: [
              ...partialAmountFilter.amount_in,
              ...parsedAmountSearchTerm.amount_in,
            ],
            conditions: [
              ...partialAmountFilter.conditions,
              ...parsedAmountSearchTerm.conditions,
            ],
          };
        },
        { amount_in: [], conditions: [] }
      );

    if (amountFilter.amount_in.length > 0) {
      filter.amount_in = amountFilter.amount_in;
    }

    if (amountFilter.conditions.length > 0 && !searchFilter) {
      filter.conditions = amountFilter.conditions;
    }

    const ibanRegex = /^[A-Za-z]{2}\d{2,36}$/;
    const ibanTerms = searchTerms.filter((term) => ibanRegex.test(term));

    if (ibanTerms.length > 0) {
      filter.iban_likeAny = ibanTerms;
    }

    if (searchFilter) {
      return {
        operator: BaseOperator.And,
        ...searchFilter,
        conditions: [filter, ...(amountFilter.conditions || [])],
      };
    }

    return filter;
  }

  /**
   * Fetches transactions in CSV format for specified date period
   * If date period is not provided, all transactions are returned
   *
   * @param args  query parameters
   * @returns     result page
   */
  public async fetchCSV(args?: AccountTransactionsCsvArgs): Promise<string> {
    const result: Query = await this.client.rawQuery(
      FETCH_TRANSACTIONS_CSV,
      args
    );
    return result.viewer?.mainAccount?.transactionsCSV ?? "";
  }

  public async fetchFilterPresets(): Promise<
    (GenericFilterPreset | MissingTaxAssetsFilterPreset)[]
  > {
    const result: Query = await this.client.rawQuery(
      FETCH_TRANSACTION_FILTER_PRESETS
    );
    return result.viewer?.mainAccount?.transactionFilterPresets ?? [];
  }
}
