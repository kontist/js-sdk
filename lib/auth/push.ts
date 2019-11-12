import { PushChallenge, PushChallengeStatus, HttpMethod, TimeoutID } from "../types";
import {
  ChallengeExpiredError,
  ChallengeDeniedError,
  MFAConfirmationCanceledError
} from "../errors";
import { TokenManager } from "./tokenManager";
import { HttpRequest } from "../request";

export const PUSH_CHALLENGE_PATH = "/api/user/mfa/challenges";

const CHALLENGE_POLL_INTERVAL = 3000;

export class PushNotificationMFA {
  private tokenManager: TokenManager;
  private request: HttpRequest;
  private challengePollInterval: number = CHALLENGE_POLL_INTERVAL;
  private challengePollTimeoutId?: TimeoutID;
  private rejectConfirmation: Function | null = null;

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
   * Called by `getConfirmedToken`. Calls itself periodically
   * until the challenge expires or its status is updated
   */
  private pollChallengeStatus = (
    pendingChallenge: PushChallenge,
    resolve: Function,
    reject: Function
  ) => async () => {
    let challenge;
    try {
      challenge = await this.request.fetch(
        `${PUSH_CHALLENGE_PATH}/${pendingChallenge.id}`,
        HttpMethod.GET
      );
    } catch (error) {
      return reject(error);
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
      const { token: confirmedToken } = await this.request.fetch(
        `${PUSH_CHALLENGE_PATH}/${challenge.id}/token`,
        HttpMethod.POST
      );

      const token = this.tokenManager.setToken(confirmedToken);
      return resolve(token);
    }

    this.rejectConfirmation = reject;
    this.challengePollTimeoutId = setTimeout(
      this.pollChallengeStatus(pendingChallenge, resolve, reject),
      this.challengePollInterval
    );
  };

  /**
   * Create an MFA challenge and request a confirmed access token when verified
   */
  public getConfirmedToken = async () => {
    const challenge = await this.request.fetch(
      PUSH_CHALLENGE_PATH,
      HttpMethod.POST
    );

    return new Promise((resolve, reject) =>
      this.pollChallengeStatus(challenge, resolve, reject)()
    );
  };

  /**
   * Clear pending MFA confirmation
   */
  public cancelConfirmation = () => {
    clearTimeout(this.challengePollTimeoutId as TimeoutID);
    if (typeof this.rejectConfirmation === "function") {
      this.rejectConfirmation(new MFAConfirmationCanceledError());
    }
  };
}
