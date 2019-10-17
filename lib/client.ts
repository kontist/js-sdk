import * as ClientOAuth2 from "client-oauth2";
import { GraphQLClient } from "graphql-request";
import { ClientOpts, GetAuthUriOpts, GetTokenOpts } from "./types";
import { KONTIST_API_BASE_URL } from "./constants";
import { Variables } from "graphql-request/dist/src/types";

export class Client {
  private oauth2Client: ClientOAuth2;
  private graphQLClient: GraphQLClient;
  private state: string;
  private token?: ClientOAuth2.Token;

  constructor(opts: ClientOpts) {
    const baseUrl = opts.baseUrl || KONTIST_API_BASE_URL;
    const { clientId, redirectUri, scopes, oauthClient } = opts;

    this.oauth2Client =
      oauthClient ||
      new ClientOAuth2({
        accessTokenUri: `${baseUrl}/api/oauth/token`,
        authorizationUri: `${baseUrl}/api/oauth/authorize`,
        clientId,
        redirectUri,
        scopes
      });

    this.state = Math.random()
      .toString()
      .substr(2);

    this.graphQLClient = new GraphQLClient(`${baseUrl}/api/graphql`);
  }

  public getAuthUri = async (opts: GetAuthUriOpts = {}): Promise<string> => {
    const query: {
      [key: string]: string | string[];
    } = {};

    if (opts.codeChallenge) {
      query.code_challenge = opts.codeChallenge;
    }

    if (opts.codeChallengeMethod) {
      query.code_challenge_method = opts.codeChallengeMethod;
    }

    const uri = await this.oauth2Client.code.getUri({
      query,
      state: this.state
    });

    return uri;
  };

  public getToken = async (
    callbackUri: string,
    opts: GetTokenOpts = {}
  ): Promise<ClientOAuth2.Token> => {
    const options: {
      state: string;
      body?: {
        code_verifier: string;
      };
    } = {
      state: this.state
    };

    if (opts.codeVerifier) {
      options.body = {
        code_verifier: opts.codeVerifier
      };
    }

    const token = await this.oauth2Client.code.getToken(callbackUri, options);

    this.token = token;

    return token;
  };

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

  public rawQuery = async (
    query: string,
    variables?: Variables
  ): Promise<Object> => {
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
}
