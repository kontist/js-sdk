import { Query, Mutation, TransferType, TransfersConnectionFilter, CardType, CardAction, CardLimitsInput } from "./schema";
export declare type FetchOptions = {
    first?: number;
    last?: number;
    before?: string | null;
    after?: string | null;
};
export declare type TransferFetchOptions = {
    type: TransferType;
    where?: TransfersConnectionFilter;
} & FetchOptions;
export declare type GetCardOptions = {
    id: String;
    type?: CardType;
};
export declare type CreateCardOptions = {
    type: string;
};
export declare type ActivateCardOptions = {
    id: string;
    verificationToken: string;
};
export declare type ChangeCardPINOptions = {
    id: string;
    pin: string;
};
export declare type ConfirmChangeCardPINOptions = {
    id: string;
    confirmationId: string;
    authorizationToken: string;
};
export declare type ChangeCardStatusOptions = {
    id: string;
    action: CardAction;
};
export declare type UpdateCardSettingsOptions = {
    id: string;
    contactlessEnabled?: boolean;
    cardNotPresentLimits?: CardLimitsInput;
    cardPresentLimits?: CardLimitsInput;
};
export declare enum SubscriptionType {
    newTransaction = "newTransaction"
}
export declare type Subscription = {
    unsubscribe: () => void;
};
export declare type RawQueryResponse = Query & Mutation;
