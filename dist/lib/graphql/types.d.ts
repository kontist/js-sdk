import { Query, Mutation, TransferType, TransfersConnectionFilter } from "./schema";
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
export declare enum SubscriptionType {
    newTransaction = "newTransaction"
}
export declare type Subscription = {
    unsubscribe: () => void;
};
export declare type RawQueryResponse = Query & Mutation;
