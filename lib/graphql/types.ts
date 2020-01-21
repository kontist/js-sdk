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

export interface CreateCardOptions {
  type: string;
}

export interface ActivateCardOptions {
  id: string;
  verificationToken: string;
}

export interface ChangeCardPINOptions {
  id: string;
  pin: string;
}

export interface ConfirmChangeCardPINOptions {
  id: string;
  confirmationId: string;
  authorizationToken: string;
}

export interface ChangeCardStatusOptions {
  id: string;
  action: CardAction;
}

export interface UpdateCardSettingsOptions {
  id: string;
  contactlessEnabled?: boolean;
  cardNotPresentLimits?: CardLimitsInput;
  cardPresentLimits?: CardLimitsInput;
}

export enum SubscriptionType {
  newTransaction = "newTransaction",
}

export interface Subscription {
  unsubscribe: () => void;
}

export type RawQueryResponse = Query & Mutation;
