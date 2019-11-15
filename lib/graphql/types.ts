import { Query, Mutation, Transaction } from "./schema";

export type FetchOptions = {
  first?: number;
  last?: number;
  before?: string | null;
  after?: string | null;
};

export enum SubscriptionType {
  newTransaction = "newTransaction"
}

export type SubscriptionEvent = {
  data?: any;
  error?: Error;
}
export type TransactionSubscriptionEvent = SubscriptionEvent & {
  data?: Transaction;
};

export type Unsubscribe = () => void;

export type RawQueryResponse = Query & Mutation;
