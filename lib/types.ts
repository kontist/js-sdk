import * as ClientOAuth2 from "client-oauth2";

export type ClientOpts = {
  baseUrl?: string;
  clientId: string;
  clientSecret?: string;
  oauthClient?: ClientOAuth2;
  redirectUri: string;
  scopes: string[];
  state: string;
  verifier?: string;
};

export type Challenge = {
  id: string;
  expiresAt: Date;
  status: ChallengeStatus;
};

export enum ChallengeStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  DENIED = "DENIED"
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
  DELETE = "DELETE"
}

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

export type VerifyDeviceChallengeResult = {
  token: string;
};
