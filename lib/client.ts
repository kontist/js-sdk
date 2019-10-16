import * as ClientOAuth2 from "client-oauth2";

class Client {
  oauth2Client: ClientOAuth2;
  state: string;

  constructor(opts: ClientOpts) {
    const baseUrl = opts.baseUrl || "https://api.kontist.com";
    const { clientId, redirectUri, scopes } = opts;

    this.oauth2Client = new ClientOAuth2({
      clientId,
      authorizationUri: `${baseUrl}/api/oauth/authorize`,
      accessTokenUri: `${baseUrl}/api/oauth/token`,
      redirectUri,
      scopes
    });

    this.state = Math.random()
      .toString()
      .substr(2);
  }

  getAuthUri = async (opts: GetAuthUriOpts = {}): Promise<string> => {
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
      state: this.state,
      query
    });

    return uri;
  };

  getToken = async (
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

export default Client;
