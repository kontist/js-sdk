import { Query, Mutation, Transaction } from "./schema";
import { FormatedError } from "subscriptions-transport-ws/dist/client";

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
  data?: SubscriptionResponse;
  error?: Error;
};

export type SubscriptionResponse = {
  newTransaction: Transaction;
};

export type Unsubscribe = () => void;

export type RawQueryResponse = Query & Mutation;
