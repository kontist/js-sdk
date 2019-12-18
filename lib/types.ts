import * as ClientOAuth2 from "client-oauth2";
import { Auth } from "./auth";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
  DELETE = "DELETE"
}

export type GraphQLClientOpts = {
  endpoint: string;
  subscriptionEndpoint: string;
  auth: Auth;
};

export type ClientOpts = {
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

export type TokenManagerOpts = {
  oauth2Client: ClientOAuth2;
  state?: string;
  verifier?: string;
};

export enum PushChallengeStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  DENIED = "DENIED"
}

export type PushChallenge = {
  id: string;
  expiresAt: Date;
  status: PushChallengeStatus;
};

export type GetAuthUriOpts = {
  query?: {
    [key: string]: string | string[];
  };
};

export type CreateDeviceParams = {
  name: string;
  key: string;
};

export type CreateDeviceResult = {
  deviceId: string;
  challengeId: string;
};

export type VerifyDeviceParams = {
  challengeId: string;
  signature: string;
};

export type DeviceChallenge = {
  id: string;
  stringToSign: string;
};

export type VerifyDeviceChallengeParams = {
  signature: string;
};

export type MfaResult = {
  token: string;
  refresh_token?: string;
};

export type TimeoutID = ReturnType<typeof setTimeout>;
