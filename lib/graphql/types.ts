import {
  CardType,
  Mutation,
  Query,
  TransfersConnectionFilter,
  TransferType,
} from "./schema";

export type FetchOptions = {
  first?: number;
  last?: number;
  before?: string | null;
  after?: string | null;
};

export type TransferFetchOptions = {
  type: TransferType;
  where?: TransfersConnectionFilter;
} & FetchOptions;

export type GetCardOptions = {
  id: string;
  type?: CardType;
};

export enum SubscriptionType {
  newTransaction = "newTransaction",
}

export type Subscription = {
  unsubscribe: () => void;
};

export type RawQueryResponse = Query & Mutation;
