import ClientOAuth2 = require("client-oauth2");

export type ClientOpts = {
  baseUrl?: string;
  clientId: string;
  oauthClient?: ClientOAuth2;
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
