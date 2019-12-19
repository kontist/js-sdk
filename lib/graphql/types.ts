import {
  Query,
  Mutation,
  TransferType,
  TransfersConnectionFilter,
  CardType,
  CardAction
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
  id: String;
  type?: CardType;
};

export type ActivateCardOptions = {
  id: string;
  verificationToken: string;
};

export type ChangeCardPINOptions = {
  id: string;
  pin: string;
};

export type ConfirmChangeCardPINOptions = {
  id: string;
  confirmationId: string;
  authorizationToken: string;
};

export type ChangeCardStatusOptions = {
  id: string;
  action: CardAction;
};

export enum SubscriptionType {
  newTransaction = "newTransaction"
}

export type Subscription = {
  unsubscribe: () => void;
};

export type RawQueryResponse = Query & Mutation;
