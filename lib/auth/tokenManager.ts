import { btoa } from "abab";
import * as ClientOAuth2 from "client-oauth2";
import { sha256 } from "js-sha256";

import { RenewTokenError, UserUnauthorizedError } from "../errors";
import { GetAuthUriOpts, TokenManagerOpts } from "../types";
import { authorizeSilently } from "../utils";

const DEFAULT_TOKEN_REFRESH_TIMEOUT = 10000;

export class TokenManager {

  /**
   * Returns current token used for API requests.
   *
   * @returns  token object which might contain token(s), scope(s), token type and expiration time
   */
  get token(): ClientOAuth2.Token | null {
    return this._token;
  }
  private oauth2Client: ClientOAuth2;
  private _token: ClientOAuth2.Token | null = null;
  private baseUrl: string;
  private state?: string;
  private verifier?: string;

  /**
   * @param baseUrl  Kontist API base url
   * @param opts     oauth2Client and optional state and verifier
   */
  constructor(baseUrl: string, opts: TokenManagerOpts) {
    const { verifier, state, oauth2Client } = opts;
    this.baseUrl = baseUrl;
    this.oauth2Client = oauth2Client;
    this.verifier = verifier;
    this.state = state;
  }

  /**
   * Build a uri to which the user must be redirected for login.
   */
  public getAuthUri = async (opts: GetAuthUriOpts = {}): Promise<string> => {
    const query: {
      [key: string]: string | string[];
    } = {
      ...(opts.query || {}),
    };

    if (this.verifier) {
      // Implemented according to https://tools.ietf.org/html/rfc7636#appendix-A
      const challenge =
        btoa(String.fromCharCode.apply(null, sha256.array(this.verifier)))!

        .split("=")[0]
        .replace("+", "-")
        .replace("/", "_");

      query.code_challenge = challenge;
      query.code_challenge_method = "S256";
    }

    return this.oauth2Client.code.getUri({ query });
  }

  /**
   * This method must be called during the callback via `redirectUri`.
   *
   * @param callbackUri  `redirectUri` containing OAuth2 data after user authentication
   * @returns            token object which might contain token(s), scope(s), token type and expiration time
   */
  public fetchToken = async (
    callbackUri: string,
  ): Promise<ClientOAuth2.Token> => {
    const options: {
      body?: {
        code_verifier: string;
      };
    } = {};

    if (this.verifier) {
      options.body = {
        code_verifier: this.verifier,
      };
    }

    const token = await this.oauth2Client.code.getToken(callbackUri, options);

    this._token = token;

    return token;
  }

  /**
   * Fetches token from owner credentials.
   * Only works for client IDs that support the 'password' grant type
   *
   * @param options     Username, password, and an optional set of scopes
   *                    When given a set of scopes, they override the default list of
   *                    scopes of `this` instance
   *
   * @returns           token object which might contain token(s), scope(s), token type and expiration time
   */
  public fetchTokenFromCredentials = async (options: {
    username: string;
    password: string;
    scopes?: string[];
  }) => {
    const getTokenOpts = options.scopes ? { scopes: options.scopes } : {};
    const token = await this.oauth2Client.owner.getToken(
      options.username,
      options.password,
      getTokenOpts,
    );

    this._token = token;

    return token;
  }

  /**
   * Refresh auth token silently for browser environments
   * Renew auth token
   *
   * @param timeout  optional timeout for renewal in ms
   */
  public refresh = async (
    timeout: number = DEFAULT_TOKEN_REFRESH_TIMEOUT,
  ): Promise<ClientOAuth2.Token> =>
    this.verifier
      ? this.renewWithWebMessage(timeout)
      : this.renewWithRefreshToken(timeout)

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
    tokenType?: string,
  ): ClientOAuth2.Token => {
    const data = {};
    let token;

    if (tokenType && refreshToken) {
      token = this.oauth2Client.createToken(
        accessToken,
        refreshToken,
        tokenType,
        data,
      );
    } else if (refreshToken) {
      token = this.oauth2Client.createToken(accessToken, refreshToken, data);
    } else {
      token = this.oauth2Client.createToken(accessToken, data);
    }

    this._token = token;

    return token;
  }

  /**
   * Renew auth token using refresh token
   *
   * @param timeout  timeout for renewal in ms
   */
  private renewWithRefreshToken = async (
    timeout: number,
  ): Promise<ClientOAuth2.Token> => {
    return new Promise(async (resolve, reject) => {
      if (!this.token) {
        throw new UserUnauthorizedError();
      }

      const timeoutId = setTimeout(() => {
        reject(
          new RenewTokenError({
            message: "Server did not respond with a new auth token, aborting.",
          }),
        );
      }, timeout);

      let token;
      try {
        token = await this.token.refresh();
      } catch (error) {
        return reject(
          new RenewTokenError({
            message: error.message,
          }),
        );
      }

      clearTimeout(timeoutId);

      this._token = token;
      return resolve(token);
    });
  }

  /**
   * Renew auth token for browser environments using web_message response mode and prompt none
   *
   * @param timeout  timeout for renewal in ms
   */
  private renewWithWebMessage = async (
    timeout: number,
  ): Promise<ClientOAuth2.Token> => {
    if (!document || !window) {
      throw new RenewTokenError({
        message:
          "Web message token renewal is only available in browser environments",
      });
    }

    const iframeUri = await this.getAuthUri({
      query: {
        prompt: "none",
        response_mode: "web_message",
      },
    });

    try {
      const code = await authorizeSilently(iframeUri, this.baseUrl, timeout);
      const fetchTokenUri = `${
        document.location.origin
      }?code=${code}&state=${encodeURIComponent(this.state || "")}`;
      const token = await this.fetchToken(fetchTokenUri);

      return token;
    } catch (error) {
      throw new RenewTokenError({
        message: error.message,
      });
    }
  }
}
