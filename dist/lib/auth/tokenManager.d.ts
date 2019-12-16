import * as ClientOAuth2 from "client-oauth2";
import { TokenManagerOpts, GetAuthUriOpts } from "../types";
export declare class TokenManager {
    private oauth2Client;
    private _token;
    private baseUrl;
    private state?;
    private verifier?;
    /**
     * @param baseUrl  Kontist API base url
     * @param opts     oauth2Client and optional state and verifier
     */
    constructor(baseUrl: string, opts: TokenManagerOpts);
    /**
     * Build a uri to which the user must be redirected for login.
     */
    getAuthUri: (opts?: GetAuthUriOpts) => Promise<string>;
    /**
     * This method must be called during the callback via `redirectUri`.
     *
     * @param callbackUri  `redirectUri` containing OAuth2 data after user authentication
     * @returns            token object which might contain token(s), scope(s), token type and expiration time
     */
    fetchToken: (callbackUri: string) => Promise<ClientOAuth2.Token>;
    /**
     * Fetches token from owner credentials.
     * Only works for client IDs that support the 'password' grant type
     *
     * @param options     Username, password, and an optional set of scopes
     *                    When given a set of scopes, they override the default list of
     *                    scopes of `this` intance
     *
     * @returns           token object which might contain token(s), scope(s), token type and expiration time
     */
    fetchTokenFromCredentials: (options: {
        username: string;
        password: string;
        scopes?: string[] | undefined;
    }) => Promise<ClientOAuth2.Token>;
    /**
     * Refresh auth token silently for browser environments
     * Renew auth token
     *
     * @param timeout  optional timeout for renewal in ms
     */
    refresh: (timeout?: number) => Promise<ClientOAuth2.Token>;
    /**
     * Renew auth token using refresh token
     *
     * @param timeout  timeout for renewal in ms
     */
    private renewWithRefreshToken;
    /**
     * Sets up  previously created token for all upcoming requests.
     *
     * @param accessToken   access token
     * @param refreshToken  optional refresh token
     * @param tokenType     token type
     * @returns             token object which might contain token(s), scope(s), token type and expiration time
     */
    setToken: (accessToken: string, refreshToken?: string | undefined, tokenType?: string | undefined) => ClientOAuth2.Token;
    /**
     * Renew auth token for browser environments using web_message response mode and prompt none
     *
     * @param timeout  timeout for renewal in ms
     */
    private renewWithWebMessage;
    /**
     * Returns current token used for API requests.
     *
     * @returns  token object which might contain token(s), scope(s), token type and expiration time
     */
    get token(): ClientOAuth2.Token | null;
}
