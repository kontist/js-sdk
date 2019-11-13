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


export type SubscriptionListeners = {
  [key: string]: Function[];
};

export type SubscriptionEvent = {
  type: SubscriptionType;
  data: SubscriptionResponse;
};

export type SubscriptionResponse = {
  newTransaction: Transaction;
};

export type RawQueryResponse = Query & Mutation;
