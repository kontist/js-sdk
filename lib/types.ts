import ClientOAuth2 = require("client-oauth2");

export type ClientOpts = {
  clientId: string;
  baseUrl?: string;
  redirectUri: string;
  scopes: string[];
};

export type GetAuthUriOpts = {
  codeChallenge?: string;
  codeChallengeMethod?: string;
};

export type GetTokenOpts = {
  codeVerifier?: string;
};

export declare class Client {
  private oauth2Client: ClientOAuth2;
  private state: string;

  constructor(opts: ClientOpts);

  public getAuthUri(opts: GetAuthUriOpts): Promise<string>;
  public getToken(callbackUri: string, opts: GetTokenOpts): Promise<ClientOAuth2.Token>;
}