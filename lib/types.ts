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
