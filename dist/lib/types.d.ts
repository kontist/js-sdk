import * as ClientOAuth2 from "client-oauth2";
import { Auth } from "./auth";
export declare enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
    DELETE = "DELETE"
}
export declare type GraphQLClientOpts = {
    endpoint: string;
    subscriptionEndpoint: string;
    auth: Auth;
};
export declare type ClientOpts = {
    baseUrl?: string;
    baseSubscriptionUrl?: string;
    clientId: string;
    clientSecret?: string;
    oauthClient?: ClientOAuth2;
    redirectUri?: string;
    scopes: string[];
    state?: string;
    verifier?: string;
};
export declare type TokenManagerOpts = {
    oauth2Client: ClientOAuth2;
    state?: string;
    verifier?: string;
};
export declare enum PushChallengeStatus {
    PENDING = "PENDING",
    VERIFIED = "VERIFIED",
    DENIED = "DENIED"
}
export declare type PushChallenge = {
    id: string;
    expiresAt: Date;
    status: PushChallengeStatus;
};
export declare type GetAuthUriOpts = {
    query?: {
        [key: string]: string | string[];
    };
};
export declare type CreateDeviceParams = {
    name: string;
    key: string;
};
export declare type CreateDeviceResult = {
    deviceId: string;
    challengeId: string;
};
export declare type VerifyDeviceParams = {
    challengeId: string;
    signature: string;
};
export declare type DeviceChallenge = {
    id: string;
    stringToSign: string;
};
export declare type VerifyDeviceChallengeParams = {
    signature: string;
};
export declare type VerifyDeviceChallengeResult = {
    token: string;
};
export declare type TimeoutID = ReturnType<typeof setTimeout>;
