type ClientOpts = {
  clientId: string;
  baseUrl?: string;
  redirectUri: string;
  scopes: Array<string>;
};

type GetAuthUriOpts = {
  codeChallenge?: string;
  codeChallengeMethod?: string;
};

type GetTokenOpts = {
  codeVerifier?: string;
};
