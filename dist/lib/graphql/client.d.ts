import { Variables } from "graphql-request/dist/src/types";
import { RawQueryResponse, SubscriptionType, Subscription } from "./types";
import { GraphQLClientOpts } from "../types";
export declare class GraphQLClient {
    private auth;
    private client;
    private subscriptionEndpoint;
    private subscriptionClient?;
    private subscriptions;
    private subscriptionId;
    constructor({ auth, endpoint, subscriptionEndpoint }: GraphQLClientOpts);
    /**
     * Send a raw GraphQL request and return its response.
     */
    rawQuery: (query: string, variables?: Variables | undefined) => Promise<RawQueryResponse>;
    /**
     * Create a subscription client
     */
    private createSubscriptionClient;
    /**
     * Handle disconnection:
     *
     * 1. Refresh access token
     * 2. Destroy existing subscription client
     * 3. Resubscribe all previously active subscriptions
     */
    private handleDisconnection;
    /**
     * Subscribe to a topic and call the respective handler when new data or an error is received
     */
    subscribe: ({ query, type, onError, onNext, subscriptionId }: {
        query: string;
        type: SubscriptionType;
        onNext: Function;
        onError?: Function | undefined;
        subscriptionId?: number | undefined;
    }) => Subscription;
    /**
     * Create an unsubscribe function to be called by the subscriber
     */
    private createUnsubscriber;
}
