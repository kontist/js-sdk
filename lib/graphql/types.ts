import {
  CardAction,
  CardLimitsInput,
  CardType,
  Mutation,
  Query,
  TransfersConnectionFilter,
  TransferType,
} from "./schema";

export interface FetchOptions {
  first?: number;
  last?: number;
  before?: string | null;
  after?: string | null;
}

export type TransferFetchOptions = {
  type: TransferType;
  where?: TransfersConnectionFilter;
} & FetchOptions;

export interface GetCardOptions {
  id: string;
  type?: CardType;
}

export enum SubscriptionType {
  newTransaction = "newTransaction",
}

export interface Subscription {
  unsubscribe: () => void;
}

export type RawQueryResponse = Query & Mutation;
