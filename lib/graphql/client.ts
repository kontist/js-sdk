import { GraphQLClient as GQLClient } from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";

import { Auth } from "../auth";
import { RawQueryResponse } from "./types";

export class GraphQLClient {
  private client: GQLClient;
  private auth: Auth;

  constructor(endpoint: string, auth: Auth) {
    this.client = new GQLClient(endpoint);
    this.auth = auth;
  }
  /**
   * Send a raw GraphQL request and return its response.
   */
  public rawQuery = async (
    query: string,
    variables?: Variables
  ): Promise<RawQueryResponse> => {
    if (!this.auth.token) {
      throw new Error("User unauthorized");
    }

    this.client.setHeader(
      "Authorization",
      `Bearer ${this.auth.token.accessToken}`
    );

    const { data } = await this.client.rawRequest(query, variables);

    return data;
  };
}
