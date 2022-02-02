import {
  ChallengeDeniedError,
  ChallengeExpiredError,
  KontistSDKError,
  MFAConfirmationCanceledError,
} from "../errors";
import {
  HttpMethod,
  MfaResult,
  PushChallenge,
  PushChallengeStatus,
  TimeoutID,
} from "../types";

import { HttpRequest } from "../request";
import { Token } from "client-oauth2";
import { TokenManager } from "./tokenManager";

export const PUSH_CHALLENGE_PATH = "/api/user/mfa/challenges";

const CHALLENGE_POLL_INTERVAL = 3000;

export class PushNotificationMFA {
  private tokenManager: TokenManager;
  private request: HttpRequest;
  private challengePollInterval: number = CHALLENGE_POLL_INTERVAL;
  private challengePollTimeoutId?: TimeoutID;
  private rejectConfirmation: ((err: KontistSDKError) => void) | null = null;

  /**
   * @param tokenManager  TokenManager instance
   * @param request       HttpRequest instance used to make requests
   *                      against Kontist REST API
   */
  constructor(tokenManager: TokenManager, request: HttpRequest) {
    this.request = request;
    this.tokenManager = tokenManager;
  }

  /**
   * Create an MFA challenge and request a confirmed access token when verified
   */
  public getConfirmedToken = async () => {
    const challenge = await this.request.fetch(
      PUSH_CHALLENGE_PATH,
      HttpMethod.POST,
    );

    return new Promise<Token>((resolve, reject) =>
      this.pollChallengeStatus(challenge, resolve, reject)(),
    );
  }

  /**
   * Clear pending MFA confirmation
   */
  public cancelConfirmation = () => {
    clearTimeout(this.challengePollTimeoutId as TimeoutID);
    if (typeof this.rejectConfirmation === "function") {
      this.rejectConfirmation(new MFAConfirmationCanceledError());
    }
  }

  /**
   * Called by `getConfirmedToken`. Calls itself periodically
   * until the challenge expires or its status is updated
   */
  private pollChallengeStatus = (
    pendingChallenge: PushChallenge,
    resolve: (token: Token) => void,
    reject: (err: Error) => void,
  ) => async () => {
    let challenge;
    try {
      challenge = await this.request.fetch(
        `${PUSH_CHALLENGE_PATH}/${pendingChallenge.id}`,
        HttpMethod.GET,
      );
    } catch (error) {
      return reject(error as Error);
    }

    this.rejectConfirmation = null;

    const hasExpired = new Date(challenge.expiresAt) < new Date();
    const wasDenied = challenge.status === PushChallengeStatus.DENIED;
    const wasVerified = challenge.status === PushChallengeStatus.VERIFIED;

    if (hasExpired) {
      return reject(new ChallengeExpiredError());
    } else if (wasDenied) {
      return reject(new ChallengeDeniedError());
    } else if (wasVerified) {
      const {
        token: accessToken,
        refresh_token: refreshToken,
      }: MfaResult = await this.request.fetch(
        `${PUSH_CHALLENGE_PATH}/${challenge.id}/token`,
        HttpMethod.POST,
      );

      const token = this.tokenManager.setToken(accessToken, refreshToken);
      return resolve(token);
    }

    this.rejectConfirmation = reject;
    this.challengePollTimeoutId = setTimeout(
      this.pollChallengeStatus(pendingChallenge, resolve, reject),
      this.challengePollInterval,
    );
  }
}
