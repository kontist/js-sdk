import * as ClientOAuth2 from "client-oauth2";
import { TokenManager } from "./tokenManager";
import { PushNotificationMFA } from "./push";
import { DeviceBinding } from "./device";
import { ClientOpts, GetAuthUriOpts } from "../types";
export declare class Auth {
    tokenManager: TokenManager;
    device: DeviceBinding;
    push: PushNotificationMFA;
    /**
     * @param baseUrl  Kontist API base url
     * @param opts     OAuth2 client data including at least clientId, redirectUri,
     *                 scopes, state and clientSecret or code verifier (for PKCE).
     * @throws         when both clientSecret and code verifier are provided
     * @throws         when verifier is provided but state or redirectUri are missing
     */
    constructor(baseUrl: string, opts: ClientOpts);
    private showDeprecationWarning;
    /**
     * @deprecated This method will be removed in v1.0.0.
     *             Use `auth.tokenManager.getAuthUri` method directly instead.
     *
     * Build a uri to which the user must be redirected for login.
     */
    getAuthUri: (opts?: GetAuthUriOpts) => Promise<string>;
    /**
     * @deprecated This method will be removed in v1.0.0.
     *             Use `auth.tokenManager.fetchToken` method directly instead.
     *
     * This method must be called during the callback via `redirectUri`.
     *
     * @param callbackUri  `redirectUri` containing OAuth2 data after user authentication
     * @returns            token object which might contain token(s), scope(s), token type and expiration time
     */
    fetchToken: (callbackUri: string) => Promise<ClientOAuth2.Token>;
    /**
     * @deprecated This method will be removed in v1.0.0.
     *             Use `auth.tokenManager.fetchTokenFromCredentials` method directly instead.
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
    fetchTokenFromCredentials: (opts: {
        username: string;
        password: string;
        scopes?: string[] | undefined;
    }) => Promise<ClientOAuth2.Token>;
    /**
     * @deprecated This method will be removed in v1.0.0.
     *             Use `auth.tokenManager.refresh` method directly instead.
     *
     * Refresh auth token silently for browser environments
     * Renew auth token
     *
     * @param timeout  optional timeout for renewal in ms
     */
    refresh: (timeout?: number | undefined) => Promise<ClientOAuth2.Token>;
    /**
     * @deprecated This method will be removed in v1.0.0.
     *             Use `auth.tokenManager.setToken` method directly instead.
     *
     * Sets up previously created token for all upcoming requests.
     *
     * @param accessToken   access token
     * @param refreshToken  optional refresh token
     * @param tokenType     token type
     * @returns             token object which might contain token(s), scope(s), token type and expiration time
     */
    setToken: (accessToken: string, refreshToken?: string | undefined, tokenType?: string | undefined) => ClientOAuth2.Token;
    /**
     * @deprecated This method will be removed in v1.0.0.
     *             Use `auth.tokenManager.token` getter directly instead.
     *
     * Returns current token used for API requests.
     *
     * @returns  token object which might contain token(s), scope(s), token type and expiration time
     */
    get token(): ClientOAuth2.Token | null;
}
