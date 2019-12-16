export declare type ErrorOpts = {
    message?: string;
    status?: number;
    type?: string;
};
export declare enum ErrorMessage {
    KONTIST_SDK_ERROR = "An error occurred",
    CHALLENGE_EXPIRED_ERROR = "Challenge expired",
    CHALLENGE_DENIED_ERROR = "Challenge denied",
    MFA_CONFIRMATION_CANCELED_ERROR = "MFA confirmation canceled",
    RENEW_TOKEN_ERROR = "Token renewal failed",
    USER_UNAUTHORIZED_ERROR = "User unauthorized",
    GRAPHQL_ERROR = "An error occurred while processing the GraphQL query"
}
export declare enum ErrorStatus {
    USER_UNAUTHORIZED_ERROR = 401
}
export declare class KontistSDKError extends Error {
    status?: number;
    type?: string;
    constructor(opts?: ErrorOpts);
}
export declare class ChallengeExpiredError extends KontistSDKError {
    constructor(opts?: ErrorOpts);
}
export declare class ChallengeDeniedError extends KontistSDKError {
    constructor(opts?: ErrorOpts);
}
export declare class MFAConfirmationCanceledError extends KontistSDKError {
    constructor(opts?: ErrorOpts);
}
export declare class UserUnauthorizedError extends KontistSDKError {
    constructor(opts?: ErrorOpts);
}
export declare class RenewTokenError extends KontistSDKError {
    constructor(opts?: ErrorOpts);
}
export declare class GraphQLError extends KontistSDKError {
    constructor(opts?: ErrorOpts);
}
