import {
  Query,
  Mutation,
  TransferType,
  TransfersConnectionFilter,
  CardType,
  CardAction,
  CardLimitsInput
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

export type CreateCardOptions = {
  type: string;
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

export type UpdateCardSettingsOptions = {
  id: string;
  contactlessEnabled?: boolean;
  cardNotPresentLimits?: CardLimitsInput;
  cardPresentLimits?: CardLimitsInput;
};

export enum SubscriptionType {
  newTransaction = "newTransaction"
}

export type Subscription = {
  unsubscribe: () => void;
};

export type ReplaceCardOptions = {
  id: string;
};

export type RawQueryResponse = Query & Mutation;
