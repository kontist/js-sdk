import {
  AccountTransactionsArgs,
  AccountTransfersArgs,
  CardType,
  Mutation,
  Query,
} from "./schema";

export type FetchOptions = AccountTransactionsArgs | AccountTransfersArgs;

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
