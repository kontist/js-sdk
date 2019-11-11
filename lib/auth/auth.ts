import * as ClientOAuth2 from "client-oauth2";

import { TokenManager } from "./tokenManager";
import { PushNotificationMFA } from "./push";
import { DeviceBinding } from "./device";
import { HttpRequest } from "../request";

import { ClientOpts, GetAuthUriOpts } from "../types";
import { KontistSDKError } from "../errors";

export class Auth {
  public tokenManager: TokenManager;
  public device: DeviceBinding;
  public push: PushNotificationMFA;

  /**
   * @param baseUrl  Kontist API base url
   * @param opts     OAuth2 client data including at least clientId, redirectUri,
   *                 scopes, state and clientSecret or code verifier (for PKCE).
   * @throws         when both clientSecret and code verifier are provided
   * @throws         when verifier is provided but state or redirectUri are missing
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

    if (verifier && clientSecret) {
      throw new KontistSDKError({
        message:
          "You can provide only one parameter from ['verifier', 'clientSecret']."
      });
    }

    if (verifier && (!state || !redirectUri)) {
      throw new KontistSDKError({
        message:
          "If you are providing a 'verifier', you must also provide 'state' and 'redirectUri' options."
      });
    }

    const oauth2Client =
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

    this.tokenManager = new TokenManager(baseUrl, {
      state,
      verifier,
      oauth2Client
    });

    const request = new HttpRequest(baseUrl, this.tokenManager);

    this.device = new DeviceBinding(this.tokenManager, request);
    this.push = new PushNotificationMFA(this.tokenManager, request);
  }

  /**
   * @deprecated use tokenManager method directly instead
   *
   * Build a uri to which the user must be redirected for login.
   */
  public getAuthUri = async (opts: GetAuthUriOpts = {}): Promise<string> =>
    this.tokenManager.getAuthUri(opts);

  /**
   * @deprecated use tokenManager method directly instead
   *
   * This method must be called during the callback via `redirectUri`.
   *
   * @param callbackUri  `redirectUri` containing OAuth2 data after user authentication
   * @returns            token object which might contain token(s), scope(s), token type and expiration time
   */
  public fetchToken = async (
    callbackUri: string
  ): Promise<ClientOAuth2.Token> => this.tokenManager.fetchToken(callbackUri);

  /**
   * @deprecated use tokenManager method directly instead
   *
   * Fetches token from owner credentials.
   * Only works for client IDs that support the 'password' grant type
   *
   * @param opts  Username, password, and an optional set of scopes
   *              When given a set of scopes, they override the default list of
   *              scopes of `this` intance
   *
   * @returns     token object which might contain token(s), scope(s), token type and expiration time
   */
  public fetchTokenFromCredentials = async (opts: {
    username: string;
    password: string;
    scopes?: string[];
  }) => this.tokenManager.fetchTokenFromCredentials(opts);

  /**
   * @deprecated use tokenManager method directly instead
   *
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
  ): ClientOAuth2.Token =>
    this.tokenManager.setToken(accessToken, refreshToken, tokenType);

  /**
   * @deprecated use tokenManager getter directly instead
   *
   * Returns current token used for API requests.
   *
   * @returns  token object which might contain token(s), scope(s), token type and expiration time
   */
  get token(): ClientOAuth2.Token | null {
    return this.tokenManager.token;
  }
}
