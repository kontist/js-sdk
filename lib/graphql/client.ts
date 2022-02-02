import * as ws from "ws";

import { Client, createClient } from "graphql-ws";
import { GraphQLError, UserUnauthorizedError } from "../errors";
import { RawQueryResponse, Subscription, SubscriptionType } from "./types";

import { Auth } from "../auth";
import { GraphQLClient as GQLClient } from "graphql-request";
import { GraphQLClientOpts } from "../types";
import { serializeGraphQLError } from "../utils";

interface Subscriptions {
  [key: number]: {
    id: number;
    query: string;
    type: SubscriptionType;
    onNext: (result: any) => void;
    onError?: (err: any) => void;
    unsubscribe: () => void;
  };
}

export class GraphQLClient {
  private auth?: Auth;
  private client: GQLClient;
  private subscriptionEndpoint: string;
  private subscriptionClient?: Client | null;
  private subscriptions: Subscriptions = {};
  private subscriptionId: number = 0;
  private createClient = createClient;

  constructor({ auth, endpoint, subscriptionEndpoint }: GraphQLClientOpts) {
    this.auth = auth;
    this.client = new GQLClient(endpoint);
    this.subscriptionEndpoint = subscriptionEndpoint;
  }

  private getAuthHeader = (): [string, string] | false => {
    if (!this.auth) {
      return false;
    }

    if (!this.auth.tokenManager.token) {
      throw new UserUnauthorizedError();
    }

    return ["Authorization", `Bearer ${this.auth.tokenManager.token.accessToken}`];
  }

  /**
   * Send a raw GraphQL request and return its response.
   */
  public rawQuery = async (
    query: string,
    variables?: {
      [key: string]: any;
    },
  ): Promise<RawQueryResponse> => {
    const auth = this.getAuthHeader();
    if (auth) this.client.setHeader(...auth);

    try {
      const { data } = await this.client.rawRequest(query, variables);
      return data;
    } catch (error) {
      throw new GraphQLError(serializeGraphQLError(error as any));
    }
  }

  /**
   * Subscribe to a topic and call the respective handler when new data or an error is received
   */
  public subscribe = ({
    query,
    type,
    onNext,
    onError,
    onComplete = () => void 0,
    subscriptionId,
  }: {
    query: string;
    type: SubscriptionType;
    onNext: (result: any) => void;
    onError?: (err: any) => void;
    onComplete?: () => void;
    subscriptionId?: number;
  }): Subscription => {
    if (!this.subscriptionClient) {
      this.subscriptionClient = this.createSubscriptionClient();

      this.subscriptionClient.on('closed', this.handleDisconnection);
    }

    const unsubscribe = this.subscriptionClient.subscribe({query}, {
      next(data: any) {
        onNext(data?.data?.[type]);
      },
      error(error) {
        if (typeof onError === "function") {
          onError(error);
        }
      },
      complete: onComplete,
    });

    const id = subscriptionId || (this.subscriptionId += 1);
    this.subscriptions[id] = {
      id,
      onError,
      onNext,
      query,
      type,
      unsubscribe,
    };

    return {
      unsubscribe: this.createUnsubscriber(id),
    };
  }

  /**
   * Create a subscription client
   */
  private createSubscriptionClient = (): Client => {
    const auth = this.getAuthHeader();
    const connectionParams = auth ? { [auth[0]]: auth[1] } : {};
    const webSocketImpl = typeof window === "undefined" ? ws : window.WebSocket;

    return this.createClient({
      url: this.subscriptionEndpoint,
      connectionParams,
      webSocketImpl,
    })
  }

  /**
   * Handle disconnection:
   *
   * 1. Refresh access token
   * 2. Destroy existing subscription client
   * 3. Resubscribe all previously active subscriptions
   */
  private handleDisconnection = async (): Promise<void> => {
    if (this.auth) {
      try {
        await this.auth.tokenManager.refresh();
      } catch (error) {
        Object.values(this.subscriptions).forEach(({ onError }) => {
          if (typeof onError === "function") {
            onError(error);
          }
        });
      }
    }

    this.subscriptionClient = null;
    Object.values(this.subscriptions).forEach((subscription) => {
      const { query, type, onNext, onError, id } = subscription;
      this.subscribe({
        onError,
        onNext,
        query,
        subscriptionId: id,
        type,
      });
    });
  }

  /**
   * Create an unsubscribe function to be called by the subscriber
   */
  private createUnsubscriber = (subscriptionId: number): (() => void) => () => {
    this.subscriptions[subscriptionId]?.unsubscribe();
    delete this.subscriptions[subscriptionId];

    if (Object.keys(this.subscriptions).length === 0) {
      this.subscriptionClient?.dispose();
      this.subscriptionClient = null;
    }
  }
}
