import { GraphQLClient as GQLClient } from "graphql-request";
import { SubscriptionClient } from "subscriptions-transport-ws";
import * as ws from "ws";

import { Auth } from "../auth";
import { GraphQLError, UserUnauthorizedError } from "../errors";
import { GraphQLClientOpts } from "../types";
import { serializeGraphQLError } from "../utils";
import { RawQueryResponse, Subscription, SubscriptionType } from "./types";

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
  private subscriptionClient?: SubscriptionClient | null;
  private subscriptions: Subscriptions = {};
  private subscriptionId: number = 0;

  constructor({ auth, endpoint, subscriptionEndpoint }: GraphQLClientOpts) {
    this.auth = auth;
    this.client = new GQLClient(endpoint);
    this.subscriptionEndpoint = subscriptionEndpoint;
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
    if (this.auth) {
      if (!this.auth.tokenManager.token) {
        throw new UserUnauthorizedError();
      }

      this.client.setHeader(
        "Authorization",
        `Bearer ${this.auth.tokenManager.token.accessToken}`,
      );
    }

    try {
      const { data } = await this.client.rawRequest(query, variables);
      return data;
    } catch (error) {
      throw new GraphQLError(serializeGraphQLError(error));
    }
  }

  /**
   * Subscribe to a topic and call the respective handler when new data or an error is received
   */
  public subscribe = ({
    query,
    type,
    onError,
    onNext,
    subscriptionId,
  }: {
    query: string;
    type: SubscriptionType;
    onNext: (result: any) => void;
    onError?: (err: any) => void;
    subscriptionId?: number;
  }): Subscription => {
    if (!this.subscriptionClient) {
      this.subscriptionClient = this.createSubscriptionClient();

      this.subscriptionClient.onDisconnected(this.handleDisconnection);
    }

    const subscription = this.subscriptionClient.request({
      query,
    });

    const { unsubscribe } = subscription.subscribe({
      next(response) {
        onNext(response.data?.[type]);
      },
      error(error) {
        if (typeof onError === "function") {
          onError(error);
        }
      },
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
  private createSubscriptionClient = (): SubscriptionClient => {
    let connectionParams = {};

    if (this.auth) {
      if (!this.auth.tokenManager.token) {
        throw new UserUnauthorizedError();
      }

      connectionParams = {
        Authorization: `Bearer ${this.auth.tokenManager.token.accessToken}`,
      }
    }


    const webSocket = typeof window === "undefined" ? ws : window.WebSocket;

    return new SubscriptionClient(
      this.subscriptionEndpoint,
      {
        connectionParams,
        lazy: true,
      },
      webSocket,
    );
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
      this.subscriptionClient?.close();
      this.subscriptionClient = null;
    }
  }
}
