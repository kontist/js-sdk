import * as ClientOAuth2 from "client-oauth2";
import { sha256 } from "js-sha256";
import { btoa } from "abab";
import { ClientOpts } from "./types";

export class Auth {
  private oauth2Client: ClientOAuth2;
  private _token: ClientOAuth2.Token | null = null;
  private verifier?: string;

  /**
   * Client OAuth2 module instance.
   *
   * @param baseUrl  Kontist API base url
   * @param opts     OAuth2 client data including at least clientId, redirectUri,
   *                 scopes, state and clientSecret or code verifier (for PKCE).
   * @throws         throws when both clientSecret and code verifier are provided
   */
  constructor(baseUrl: string, opts: ClientOpts) {
    const {
      clientId,
      clientSecret,
      oauthClient,
      redirectUri,
      scopes,
      state,
      verifier
    } = opts;
    this.verifier = verifier;

    if (verifier && clientSecret) {
      throw new Error(
        "You can provide only one parameter from ['verifier', 'clientSecret']."
      );
    }

    this.oauth2Client =
      oauthClient ||
      new ClientOAuth2({
        accessTokenUri: `${baseUrl}/api/oauth/token`,
        authorizationUri: `${baseUrl}/api/oauth/authorize`,
        clientId,
        clientSecret,
        redirectUri,
        scopes,
        state
      });
  }

  /**
   * Build a uri to which the user must be redirected for login.
   */
  public getAuthUri = async (): Promise<string> => {
    const query: {
      [key: string]: string | string[];
    } = {};

    if (this.verifier) {
      // Implemented according to https://tools.ietf.org/html/rfc7636#appendix-A
      const challenge = (
        btoa(String.fromCharCode.apply(null, sha256.array(this.verifier))) || ""
      )
        .split("=")[0]
        .replace("+", "-")
        .replace("/", "_");

      query.code_challenge = challenge;
      query.code_challenge_method = "S256";
    }

    return this.oauth2Client.code.getUri({ query });
  };

  /**
   * This method must be called during the callback via `redirectUri`.
   *
   * @param callbackUri  `redirectUri` containing OAuth2 data after user authentication
   * @returns            token object which might contain token(s), scope(s), token type and expiration time
   */
  public fetchToken = async (
    callbackUri: string
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

    this._token = token;

    return token;
  };

  /**
   * Sets up  previously created token for all upcoming requests.
   *
   * @param accessToken   access token
   * @param refreshToken  optional refresh token
   * @param tokenType     token type
   * @returns             token object which might contain token(s), scope(s), token type and expiration time
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

    this._token = token;

    return token;
  };

  /**
   * Returns current token used for API requests.
   *
   * @returns  token object which might contain token(s), scope(s), token type and expiration time
   */
  get token(): ClientOAuth2.Token | null {
    return this._token;
  }
}
