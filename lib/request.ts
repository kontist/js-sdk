import "cross-fetch/polyfill";

import { TokenManager } from "./auth/tokenManager";
import { KontistSDKError, UserUnauthorizedError } from "./errors";
import { HttpMethod } from "./types";

const HTTP_STATUS_NO_CONTENT = 204;

export class HttpRequest {

  /**
   * @param baseUrl       base URL against which requests will be made
   * @param tokenManager  TokenManager instance used for authorizing requests
   */
  constructor(
    private baseUrl: string,
    private tokenManager: TokenManager,
  ) {}

  /**
   * Perform an HTTP request
   */
  public fetch = async (
    path: string,
    method: HttpMethod,
    body?: string | Object
  ) => {
    if (!this.tokenManager.token) {
      throw new UserUnauthorizedError();
    }

    const requestUrl = new URL(path, this.baseUrl).href;

    const response = await fetch(requestUrl, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.tokenManager.token.accessToken}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new KontistSDKError({
        status: response.status,
        message: response.statusText
      });
    }

    if (response.status === HTTP_STATUS_NO_CONTENT) {
      return;
    }

    return response.json();
  };
}
