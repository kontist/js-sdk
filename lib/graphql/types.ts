import {
  CardType,
  Mutation,
  Query,
} from "./schema";

export type FetchOptions = {
  first?: number;
  last?: number;
  before?: string | null;
  after?: string | null;
};

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
