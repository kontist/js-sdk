import * as ClientOAuth2 from "client-oauth2";
import { ClientOpts, GetAuthUriOpts, GetTokenOpts } from "./types";
import { KONTIST_API_BASE_URL } from "./constants";

export class Client {
  private oauth2Client: ClientOAuth2;
  private state: string;

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

    const tokenData = await this.oauth2Client.code.getToken(
      callbackUri,
      options
    );
    return tokenData;
  };
}
