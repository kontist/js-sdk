import * as ClientOAuth2 from "client-oauth2";
import { CreateDeviceParams, CreateDeviceResult, VerifyDeviceParams, DeviceChallenge, VerifyDeviceChallengeParams } from "../types";
import { TokenManager } from "./tokenManager";
import { HttpRequest } from "../request";
export declare const CREATE_DEVICE_PATH = "/api/user/devices";
export declare const VERIFY_DEVICE_PATH: (deviceId: string) => string;
export declare const CREATE_DEVICE_CHALLENGE_PATH: (deviceId: string) => string;
export declare const VERIFY_DEVICE_CHALLENGE_PATH: (deviceId: string, challengeId: string) => string;
export declare class DeviceBinding {
    private tokenManager;
    private request;
    /**
     * @param tokenManager  TokenManager instance
     * @param request       HttpRequest instance used to make requests
     *                      against Kontist REST API
     */
    constructor(tokenManager: TokenManager, request: HttpRequest);
    /**
     * Create a device and return its `deviceId` and `challengeId` for verification
     */
    createDevice: (params: CreateDeviceParams) => Promise<CreateDeviceResult>;
    /**
     * Verify the device by providing signed OTP received via SMS
     */
    verifyDevice: (deviceId: string, params: VerifyDeviceParams) => Promise<void>;
    /**
     * Create a device challenge and return string to sign by private key
     */
    createDeviceChallenge: (deviceId: string) => Promise<DeviceChallenge>;
    /**
     * Verify the device challenge and update access token
     */
    verifyDeviceChallenge: (deviceId: string, challengeId: string, params: VerifyDeviceChallengeParams) => Promise<ClientOAuth2.Token>;
}
