import "cross-fetch/polyfill";
import { TokenManager } from "./auth/tokenManager";
import { HttpMethod } from "./types";
export declare class HttpRequest {
    private baseUrl;
    private tokenManager;
    /**
     * @param baseUrl       base URL against which requests will be made
     * @param tokenManager  TokenManager instance used for authorizing requests
     */
    constructor(baseUrl: string, tokenManager: TokenManager);
    /**
     * Perform an HTTP request
     */
    fetch: (path: string, method: HttpMethod, body?: string | Object | undefined) => Promise<any>;
}
