import { GraphQLClient as GQLClient } from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";

import { Auth } from "../auth";
import { RawQueryResponse } from "./types";
import { serializeGraphQLError } from "../utils";
import { GraphQLError, UserUnauthorizedError } from "../errors";

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
}
