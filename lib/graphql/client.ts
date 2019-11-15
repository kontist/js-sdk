import { GraphQLClient as GQLClient } from "graphql-request";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Variables } from "graphql-request/dist/src/types";
import * as ws from "ws";

import { Auth } from "../auth";
import { RawQueryResponse, SubscriptionType, Unsubscribe } from "./types";
import { serializeGraphQLError } from "../utils";
import { GraphQLError, UserUnauthorizedError } from "../errors";
import { GraphQLClientOpts } from "../types";

type Subscriptions = {
  [key: number]: {
    id: number;
    query: string;
    type: SubscriptionType;
    handler: Function;
    unsubscribe: Unsubscribe;
  };
};

type ConnectionParams = {
  Authorization: string;
};

export class GraphQLClient {
  private auth: Auth;
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
    variables?: Variables
  ): Promise<RawQueryResponse> => {
    if (!this.auth.tokenManager.token) {
      throw new UserUnauthorizedError();
    }

    this.client.setHeader(
      "Authorization",
      `Bearer ${this.auth.tokenManager.token.accessToken}`
    );

    try {
      const { data } = await this.client.rawRequest(query, variables);
      return data;
    } catch (error) {
      throw new GraphQLError(serializeGraphQLError(error));
    }
  };

  /**
   * Return subscription client connection params
   */
  private getConnectionParams = (): ConnectionParams => ({
    Authorization: `Bearer ${this.auth.tokenManager.token?.accessToken}`
  });

  /**
   * Create a subscription client
   */
  private createSubscriptionClient = (): SubscriptionClient => {
    if (!this.auth.tokenManager.token) {
      throw new UserUnauthorizedError();
    }

    const WebSocket = typeof window === "undefined" ? ws : window.WebSocket;

    return new SubscriptionClient(
      this.subscriptionEndpoint,
      {
        lazy: true,
        connectionParams: this.getConnectionParams
      },
      WebSocket
    );
  };

  /**
   * Handle disconnection:
   *
   * 1. Refresh access token
   * 2. Destroy existing subscription client
   * 3. Resubscribe all previously active subscriptions
   */
  private handleDisconnection = async (): Promise<void> => {
    await this.auth.tokenManager.refresh();
    this.subscriptionClient = null;
    Object.values(this.subscriptions).forEach(subscription => {
      this.subscribe(
        subscription.query,
        subscription.type,
        subscription.handler,
        subscription.id
      );
    });
  };

  /**
   * Subscribe to a topic and call the handler when new data or an error is received
   */
  public subscribe = (
    query: string,
    type: SubscriptionType,
    handler: Function,
    subscriptionId?: number
  ): Unsubscribe => {
    if (!this.subscriptionClient) {
      this.subscriptionClient = this.createSubscriptionClient();

      this.subscriptionClient.onDisconnected(this.handleDisconnection);
    }

    const subscription = this.subscriptionClient.request({
      query
    });

    const { unsubscribe } = subscription.subscribe({
      next(response) {
        handler({
          data: response.data?.[type]
        });
      },
      error(error) {
        handler({
          data: null,
          error
        });
      }
    });

    const id = subscriptionId || (this.subscriptionId += 1);
    this.subscriptions[id] = {
      id,
      query,
      type,
      handler,
      unsubscribe
    };

    return this.unsubscribe(id);
  };

  /**
   * Unsubscribe to a topic
   */
  public unsubscribe = (subscriptionId: number): (() => void) => () => {
    this.subscriptions[subscriptionId].unsubscribe();
    delete this.subscriptions[subscriptionId];

    if (Object.keys(this.subscriptions).length === 0) {
      this.subscriptionClient?.close();
      this.subscriptionClient = null;
    }
  };
}
