import fetch, { Response } from "node-fetch";

import { TokenManager } from "./auth/tokenManager";
import { KontistSDKError, UserUnauthorizedError } from "./errors";
import { HttpMethod } from "./types";

const HTTP_STATUS_NO_CONTENT = 204;

export class HttpRequest {
  /**
   * @param baseUrl       base URL against which requests will be made
   * @param tokenManager  TokenManager instance used for authorizing requests
   */
  constructor(private baseUrl: string, private tokenManager: TokenManager) {}

  /**
   * Perform an HTTP request
   */
  public fetch = async (
    path: string,
    method: HttpMethod,
    body?: string | object
  ): Promise<any> => {
    if (!this.tokenManager.token) {
      throw new UserUnauthorizedError();
    }

    const requestUrl = new URL(path, this.baseUrl).href;
    let response: Response;

    try {
      response = await fetch(requestUrl, {
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.tokenManager.token.accessToken}`,
          "Content-Type": "application/json",
        },
        method,
      });

      if (!response || !response.ok) {
        throw new KontistSDKError({
          message: response.statusText,
          status: response.status,
        });
      }

      if (response.status === HTTP_STATUS_NO_CONTENT) {
        return;
      }

      return response.json();
    } catch (e) {
      throw new KontistSDKError({
        message: e.message,
        status: e.status,
      });
    }
  };
}
