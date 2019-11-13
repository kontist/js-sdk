import { GraphQLClient as GQLClient } from "graphql-request";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { Variables } from "graphql-request/dist/src/types";
import * as ws from "ws";

import { Auth } from "../auth";
import { RawQueryResponse } from "./types";
import { serializeGraphQLError } from "../utils";
import { GraphQLError, UserUnauthorizedError } from "../errors";
import { GraphQLClientOpts } from "../types";

const WebSocket = typeof window === "undefined" ? ws : window.WebSocket;

type Subscriptions = {
  [key: string]: Function;
};

export class GraphQLClient {
  private auth: Auth;
  private client: GQLClient;
  private subscriptionClient: SubscriptionClient;
  private subscriptions: Subscriptions = {};

  constructor({ auth, endpoint, subscriptionEndpoint }: GraphQLClientOpts) {
    this.auth = auth;
    this.client = new GQLClient(endpoint);
    this.subscriptionClient = new SubscriptionClient(
      subscriptionEndpoint,
      {
        lazy: true,
        reconnect: true,
        connectionParams: () => ({
          Authorization: `Bearer ${this.auth.tokenManager.token?.accessToken}`
        })
      },
      WebSocket
    );
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
   * Subscribe to a topic and call the handler when new data is received
   */
  public subscribe = (query: string, topic: string, handler: Function) => {
    const subscription = this.subscriptionClient.request({
      query
    });

    const { unsubscribe } = subscription.subscribe({
      next(response) {
        handler({
          type: topic,
          data: response.data?.[topic]
        });
      }
    });

    this.subscriptions[topic] = unsubscribe;
  };

  /**
   * Unsubscribe to a topic
   */
  public unsubscribe = (topic: string) => {
    if (this.subscriptions[topic]) {
      this.subscriptions[topic]();
    }
    delete this.subscriptions[topic];
  };
}
