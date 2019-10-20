import * as ClientOAuth2 from "client-oauth2";
import { GraphQLClient } from "graphql-request";
import { sha256 } from 'js-sha256';
import { Variables } from "graphql-request/dist/src/types";
import { btoa } from "abab";
import * as _ from "lodash";

import { ClientOpts, GetAuthUriOpts, GetTokenOpts } from "./types";
import { KONTIST_API_BASE_URL } from "./constants";
import { Query, TransactionListItem, TransactionsConnectionEdge } from "./graphql/schema";

export class Client {
  private oauth2Client: ClientOAuth2;
  private graphQLClient: GraphQLClient;
  private token?: ClientOAuth2.Token;
  private verifier?: string;

  constructor(opts: ClientOpts) {
    const baseUrl = opts.baseUrl || KONTIST_API_BASE_URL;
    const { clientId, redirectUri, scopes, oauthClient, state, verifier } = opts;
    this.verifier = verifier;

    this.oauth2Client =
      oauthClient ||
      new ClientOAuth2({
        accessTokenUri: `${baseUrl}/api/oauth/token`,
        authorizationUri: `${baseUrl}/api/oauth/authorize`,
        clientId,
        redirectUri,
        scopes,
        state
      });

    this.graphQLClient = new GraphQLClient(`${baseUrl}/api/graphql`);
  }

  /**
   * Build a uri to which the user must be redirected for login.
   */
  public getAuthUri = async (opts: GetAuthUriOpts = {}): Promise<string> => {
    const query: {
      [key: string]: string | string[];
    } = {};

    if (this.verifier) {
      // Implemented according to https://tools.ietf.org/html/rfc7636#appendix-A
      const challenge =
        (btoa(String.fromCharCode.apply(null, sha256.array(this.verifier))) || "")
          .split("=")[0]
          .replace("+", "-")
          .replace("/", "_")

      query.code_challenge = challenge;
      query.code_challenge_method = 'S256';
    }

    return this.oauth2Client.code.getUri({ query });
  };

  /**
   * This method must be called during the callback via `redirectUri`.
   */
  public getToken = async (
    callbackUri: string,
    opts: GetTokenOpts = {}
  ): Promise<ClientOAuth2.Token> => {
    const options: {
      body?: {
        code_verifier: string;
      };
    } = {};

    if (this.verifier) {
      options.body = {
        code_verifier: this.verifier
      };
    }

    const token = await this.oauth2Client.code.getToken(callbackUri, options);

    this.token = token;

    return token;
  };

  /**
   * Use a previously created token for all upcoming requests.
   */
  public setToken = (
    accessToken: string,
    refreshToken?: string,
    tokenType?: string
  ): ClientOAuth2.Token => {
    const data = {};
    let token;

    if (tokenType && refreshToken) {
      token = this.oauth2Client.createToken(
        accessToken,
        refreshToken,
        tokenType,
        data
      );
    } else if (refreshToken) {
      token = this.oauth2Client.createToken(accessToken, refreshToken, data);
    } else {
      token = this.oauth2Client.createToken(accessToken, data);
    }

    this.token = token;
    return token;
  };

  /**
   * Send a raw GraphQL request and return its response.
   */
  public rawQuery = async (
    query: string,
    variables?: Variables
  ): Promise<Query> => {
    if (!this.token) {
      throw new Error("User unauthorized");
    }

    this.graphQLClient.setHeader(
      "Authorization",
      `Bearer ${this.token.accessToken}`
    );

    const { data } = await this.graphQLClient.rawRequest(query, variables);

    return data;
  };

  public getAllTransactions = async (): Promise<Array<TransactionListItem>> => {
    const query = `{
      viewer {
          mainAccount {
            transactions {
              edges {
                node {
                  id
                  amount
                  name
                  iban
                  type
                  bookingDate
                  valutaDate
                  originalAmount
                  foreignCurrency
                  e2eId
                  mandateNumber
                  paymentMethod
                  category
                  userSelectedBookingDate
                  purpose
                  bookingType
                  invoiceNumber
                  invoicePreviewUrl
                  invoiceDownloadUrl
                  documentType
                }
              }
            }
          }
        }
      }`;

    const result: Query = await this.rawQuery(query);

    const transactions = _.get(
      result,
      "viewer.mainAccount.transactions.edges",
      []
    ).map((edge: TransactionsConnectionEdge) => edge.node);

    return transactions;
  };
}
