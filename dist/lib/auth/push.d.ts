import { TokenManager } from "./tokenManager";
import { HttpRequest } from "../request";
export declare const PUSH_CHALLENGE_PATH = "/api/user/mfa/challenges";
export declare class PushNotificationMFA {
    private tokenManager;
    private request;
    private challengePollInterval;
    private challengePollTimeoutId?;
    private rejectConfirmation;
    /**
     * @param tokenManager  TokenManager instance
     * @param request       HttpRequest instance used to make requests
     *                      against Kontist REST API
     */
    constructor(tokenManager: TokenManager, request: HttpRequest);
    /**
     * Called by `getConfirmedToken`. Calls itself periodically
     * until the challenge expires or its status is updated
     */
    private pollChallengeStatus;
    /**
     * Create an MFA challenge and request a confirmed access token when verified
     */
    getConfirmedToken: () => Promise<unknown>;
    /**
     * Clear pending MFA confirmation
     */
    cancelConfirmation: () => void;
}
