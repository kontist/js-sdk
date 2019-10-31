import * as ClientOAuth2 from "client-oauth2";

export type ClientOpts = {
  baseUrl?: string;
  clientId: string;
  clientSecret?: string;
  oauthClient?: ClientOAuth2;
  redirectUri: string;
  scopes: string[];
  state: string;
  verifier?: string;
};
