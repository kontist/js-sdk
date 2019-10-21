import { GraphQLClient as GQLClient } from "graphql-request";
import { Variables } from "graphql-request/dist/src/types";

import { Auth } from "../auth";
import { Query } from "./schema";

export class GraphQLClient {
  private client: GQLClient;
  private auth: Auth;

  constructor(baseUrl: string, auth: Auth) {
    this.client = new GQLClient(`${baseUrl}/api/graphql`);
    this.auth = auth;
  }
  /**
   * Send a raw GraphQL request and return its response.
   */
  public rawQuery = async (
    query: string,
    variables?: Variables
  ): Promise<Query> => {
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
