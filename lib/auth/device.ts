import * as ClientOAuth2 from "client-oauth2";

import {
  HttpMethod,
  CreateDeviceParams,
  CreateDeviceResult,
  VerifyDeviceParams,
  DeviceChallenge,
  VerifyDeviceChallengeParams,
  VerifyDeviceChallengeResult
} from "../types";
import { TokenManager } from "./tokenManager";
import { HttpRequest } from "../request";

export const CREATE_DEVICE_PATH = "/api/user/devices";
export const VERIFY_DEVICE_PATH = (deviceId: string) =>
  `/api/user/devices/${deviceId}/verify`;
export const CREATE_DEVICE_CHALLENGE_PATH = (deviceId: string) =>
  `/api/user/devices/${deviceId}/challenges`;
export const VERIFY_DEVICE_CHALLENGE_PATH = (
  deviceId: string,
  challengeId: string
) => `/api/user/devices/${deviceId}/challenges/${challengeId}/verify`;

export class DeviceBinding {
  private tokenManager: TokenManager;
  private request: HttpRequest;

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
   * Create a device and return its `deviceId` and `challengeId` for verification
   */
  public createDevice = (
    params: CreateDeviceParams
  ): Promise<CreateDeviceResult> => {
    return this.request.fetch(CREATE_DEVICE_PATH, HttpMethod.POST, params);
  };

  /**
   * Verify the device by providing signed OTP received via SMS
   */
  public verifyDevice = (
    deviceId: string,
    params: VerifyDeviceParams
  ): Promise<void> => {
    return this.request.fetch(
      VERIFY_DEVICE_PATH(deviceId),
      HttpMethod.POST,
      params
    );
  };

  /**
   * Create a device challenge and return string to sign by private key
   */
  public createDeviceChallenge = (
    deviceId: string
  ): Promise<DeviceChallenge> => {
    return this.request.fetch(
      CREATE_DEVICE_CHALLENGE_PATH(deviceId),
      HttpMethod.POST
    );
  };

  /**
   * Verify the device challenge and update access token
   */
  public verifyDeviceChallenge = async (
    deviceId: string,
    challengeId: string,
    params: VerifyDeviceChallengeParams
  ): Promise<ClientOAuth2.Token> => {
    const {
      token: accessToken
    }: VerifyDeviceChallengeResult = await this.request.fetch(
      VERIFY_DEVICE_CHALLENGE_PATH(deviceId, challengeId),
      HttpMethod.POST,
      params
    );
    const { refreshToken } = this.tokenManager.token || {};
    return this.tokenManager.setToken(accessToken, refreshToken);
  };
}
