import { expect } from "chai";
import * as sinon from "sinon";

import { createClient } from "../helpers";

describe("Auth: DeviceBinding", () => {
  describe("#createDevice", () => {
    const createDeviceParams = {
      name: "iPhone XS",
      key:
        "0402e86575939cd541f016b69b1bc6ee97736f7a6d32c0ad375695ffdc03acf21a3b54224fd164ad6f9cfdfb42b74f49f3d34a41f95d62e893be4977c7ec154f29"
    };

    const createDeviceResponse = {
      deviceId: "daecde61-18a4-4010-a0f7-a8b21c27996a",
      challengeId: "daecde61-18a4-4010-a0f7-a8b21c27996a"
    };

    it("should create device", async () => {
      const client = createClient();
      const requestStub = sinon
        .stub(client.auth.device["request"], "fetch")
        .resolves(createDeviceResponse);
      const result = await client.auth.device.createDevice(createDeviceParams);

      expect(requestStub.callCount).to.equal(1);
      expect(requestStub.getCall(0).args).to.eql([
        "/api/user/devices",
        "POST",
        createDeviceParams
      ]);
      expect(result).to.equal(createDeviceResponse);

      requestStub.restore();
    });
  });

  describe("#verifyDevice", () => {
    const deviceId = "daecde61-18a4-4010-a0f7-a8b21c27996a";

    const verifyDeviceParams = {
      challengeId: "daecde61-18a4-4010-a0f7-a8b21c27996a",
      signature: "fake-signature"
    };

    it("should verify device", async () => {
      const client = createClient();
      const requestStub = sinon
        .stub(client.auth.device["request"], "fetch")
        .resolves();
      const result = await client.auth.device.verifyDevice(
        deviceId,
        verifyDeviceParams
      );

      expect(requestStub.callCount).to.equal(1);
      expect(requestStub.getCall(0).args).to.eql([
        `/api/user/devices/${deviceId}/verify`,
        "POST",
        verifyDeviceParams
      ]);
      expect(result).to.equal(undefined);

      requestStub.restore();
    });
  });

  describe("#createDeviceChallenge", () => {
    const deviceId = "daecde61-18a4-4010-a0f7-a8b21c27996a";

    const createDeviceChallengeResponse = {
      id: "83d1a026-dc80-48dc-bc15-4b672716050d",
      stringToSign: "7b6ad39f-1593-4f4d-a84d-b539cc25a3cf"
    };

    it("should create device challenge", async () => {
      const client = createClient();
      const requestStub = sinon
        .stub(client.auth.device["request"], "fetch")
        .resolves(createDeviceChallengeResponse);
      const result = await client.auth.device.createDeviceChallenge(deviceId);

      expect(requestStub.callCount).to.equal(1);
      expect(requestStub.getCall(0).args).to.eql([
        `/api/user/devices/${deviceId}/challenges`,
        "POST"
      ]);
      expect(result).to.equal(createDeviceChallengeResponse);

      requestStub.restore();
    });
  });

  describe("#verifyDeviceChallenge", () => {
    const deviceId = "daecde61-18a4-4010-a0f7-a8b21c27996a";
    const challengeId = "83d1a026-dc80-48dc-bc15-4b672716050d";

    const verifyDeviceChallengeParams = {
      signature: "fake-signature"
    };

    const verifyDeviceChallengeResponse = {
      token: "fake-confirmed-token"
    };

    it("should verify device challenge", async () => {
      const client = createClient();
      const requestStub = sinon
        .stub(client.auth.device["request"], "fetch")
        .resolves(verifyDeviceChallengeResponse);
      const result = await client.auth.device.verifyDeviceChallenge(
        deviceId,
        challengeId,
        verifyDeviceChallengeParams
      );

      expect(requestStub.callCount).to.equal(1);
      expect(requestStub.getCall(0).args).to.eql([
        `/api/user/devices/${deviceId}/challenges/${challengeId}/verify`,
        "POST",
        verifyDeviceChallengeParams
      ]);
      expect(result.accessToken).to.equal(verifyDeviceChallengeResponse.token);
      expect(client.auth.tokenManager.token && client.auth.tokenManager.token.accessToken).to.equal(
        verifyDeviceChallengeResponse.token
      );

      requestStub.restore();
    });
  });
});
