import { expect } from "chai";
import * as sinon from "sinon";
import * as moment from "moment";
import ClientOAuth2 = require("client-oauth2");
import { Client, Constants } from "../lib";
import { MFA_CHALLENGE_PATH } from "../lib/auth";
import { HttpMethod, ChallengeStatus } from "../lib/types";
import * as utils from "../lib/utils";

describe("Auth", () => {
  const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
  const redirectUri = "https://localhost:3000/auth/callback";
  const scopes = ["transactions"];
  const state = "25843739712322056";
  const verifier = "Huag6ykQU7SaEYKtmNUeM8txt4HzEIfG";
  const clientSecret = "very-secret";

  const createClient = (opts = {}) => {
    return new Client({
      clientId,
      redirectUri,
      scopes,
      state,
      ...opts
    });
  };

  let client: Client;

  describe("client.auth.getAuthUri()", () => {
    it("should return proper redirect url when clientSecret is provided", async () => {
      client = createClient({ clientSecret });
      const url = await client.auth.getAuthUri();
      const expectedUrl = `${Constants.KONTIST_API_BASE_URL}/api/oauth/authorize?client_id=${clientId}&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scope=transactions&response_type=code&state=25843739712322056`;
      expect(url).to.equal(expectedUrl);
    });

    it("should return proper redirect url when code verifier is provided", async () => {
      client = createClient({ verifier });
      const codeChallenge = "xc3uY4-XMuobNWXzzfEqbYx3rUYBH69_zu4EFQIJH8w";
      const codeChallengeMethod = "S256";
      const url = await client.auth.getAuthUri();
      const expectedUrl = `${Constants.KONTIST_API_BASE_URL}/api/oauth/authorize?client_id=${clientId}&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scope=transactions&response_type=code&state=25843739712322056&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;
      expect(url).to.equal(expectedUrl);
    });
  });

  describe("client.auth.fetchToken()", () => {
    const callbackUrl = `${redirectUri}?code=a253a28a749cb31e7ba7487b9e240b53f6783317&state=25843739712322056`;
    const tokenResponseData = {
      access_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      refresh_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1",
      token_type: "Bearer"
    };
    let oauthClient: ClientOAuth2;
    let tokenData: ClientOAuth2.Token;

    beforeEach(() => {
      oauthClient = new ClientOAuth2({});

      sinon.stub(oauthClient.code, "getToken").callsFake(async () => {
        return new ClientOAuth2.Token(oauthClient, tokenResponseData);
      });
    });

    describe("for code verifier", () => {
      beforeEach(async () => {
        const client = createClient({ verifier, oauthClient });
        tokenData = await client.auth.fetchToken(callbackUrl);
      });

      it("should call oauthClient.code.getToken() with proper arguments", () => {
        const stub = oauthClient.code.getToken as sinon.SinonStub;
        const [url, opts] = stub.getCall(0).args;
        expect(url).to.equal(callbackUrl);
        expect(opts).to.deep.equal({
          body: {
            code_verifier: verifier
          }
        });
      });

      it("should return token data", () => {
        expect(tokenData.data).to.deep.equal(tokenResponseData);
      });
    });

    describe("for client secret", () => {
      beforeEach(async () => {
        const client = createClient({ clientSecret, oauthClient });
        tokenData = await client.auth.fetchToken(callbackUrl);
      });

      it("should call oauthClient.code.getToken() with an empty object", () => {
        const stub = oauthClient.code.getToken as sinon.SinonStub;
        const [url, opts] = stub.getCall(0).args;
        expect(url).to.equal(callbackUrl);
        expect(opts).to.deep.equal({});
      });

      it("should return token data", () => {
        expect(tokenData.data).to.deep.equal(tokenResponseData);
      });
    });
  });

  describe("client.auth.setToken()", () => {
    it("should be able to set access token", () => {
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNThmNzg5Ny03YzdlLTQzMWItYTY2MS0yMDYzNjE0YzM0YTYiLCJzY29wZSI6InRyYW5zYWN0aW9ucyIsImNsaWVudF9pZCI6IjI2OTkwMjE2LWUzNDAtNGY1NC1iNWE1LWRmOWJhYWNjMDQ0MSIsImlhdCI6MTU3MTMyNzYwOSwiZXhwIjoxNTcxMzMxMjA5fQ.JrDN1w5bh43QgV3buXQSlD5utk74NIXbOGETFPMJH6A";
      const refreshToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNThmNzg5Ny03YzdlLTQzMWItYTY2MS0yMDYzNjE0YzM0YTYiLCJzY29wZSI6InJlZnJlc2ggdHJhbnNhY3Rpb25zIiwiY2xpZW50X2lkIjoiMjY5OTAyMTYtZTM0MC00ZjU0LWI1YTUtZGY5YmFhY2MwNDQxIiwiaWF0IjoxNTcxMzI3NjA5LCJleHAiOjE1NzEzMzQ4MDl9.HWSA7hB54WEznBaWzvZKwd_fXuLBQqD0kHugidkzW4U";
      const tokenType = "bearer";

      let token = client.auth.setToken(accessToken);
      expect(token.accessToken).to.equal(accessToken);

      token = client.auth.setToken(accessToken, refreshToken);
      expect(token.accessToken).to.equal(accessToken);
      expect(token.refreshToken).to.equal(refreshToken);

      token = client.auth.setToken(accessToken, refreshToken, tokenType);
      expect(token.accessToken).to.equal(accessToken);
      expect(token.refreshToken).to.equal(refreshToken);
      expect(token.tokenType).to.equal(tokenType);
    });
  });

  describe("client.auth.fetchTokenFromCredentials", () => {
    const username = "user@kontist.com";
    const password = "test1234";
    const scopes = ["transfers"];

    const tokenResponseData = {
      access_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      token_type: "Bearer"
    };

    let oauthClient: ClientOAuth2;
    let client: Client;

    beforeEach(() => {
      oauthClient = new ClientOAuth2({});

      sinon.stub(oauthClient.owner, "getToken").callsFake(async () => {
        return new ClientOAuth2.Token(oauthClient, tokenResponseData);
      });

      client = createClient({ oauthClient });
    });

    it("should call oauthClient.owner.getToken() with proper arguments", async () => {
      await client.auth.fetchTokenFromCredentials({ username, password });

      const stub = oauthClient.owner.getToken as sinon.SinonStub;
      const args = stub.getCall(0).args;
      expect(args).to.deep.equal([ username, password, {} ]);
    });

    it("should return token data", async () => {
      const tokenData = await client.auth.fetchTokenFromCredentials({ username, password });

      expect(tokenData.data).to.deep.equal(tokenResponseData);
    });

    it("should forward `scopes` to oauthClient.owner.getToken() when set", async () => {
      await client.auth.fetchTokenFromCredentials({ username, password, scopes });

      const stub = oauthClient.owner.getToken as sinon.SinonStub;
      const args = stub.getCall(0).args;
      expect(args).to.deep.equal([ username, password, { scopes } ]);
    });
  });

  describe("when both code verifier and code secret are provided", () => {
    it("should throw an error", () => {
      let error;
      try {
        client = createClient({ verifier, clientSecret });
      } catch (err) {
        error = err;
      }

      expect(error.message).to.equal(
        "You can provide only one parameter from ['verifier', 'clientSecret']."
      );
    });
  });

  describe("client.auth.getMFAConfirmedToken()", () => {
    const setup = (updatedChallenge: Object) => {
      const challenge = {
        id: "35f31e77-467a-472a-837b-c34ad3c8a9b4",
        status: ChallengeStatus.PENDING,
        expiresAt: moment().add(10, "minutes")
      };
      const confirmedToken = "cnf-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

      const client = createClient();

      client.auth["challengePollInterval"] = 0;

      const requestStub = sinon.stub(client.auth, <any>"request");
      requestStub
        .withArgs(MFA_CHALLENGE_PATH, HttpMethod.POST)
        .resolves(challenge);
      requestStub
        .withArgs(`${MFA_CHALLENGE_PATH}/${challenge.id}`, HttpMethod.GET)
        .onFirstCall()
        .resolves(challenge)
        .onSecondCall()
        .resolves({
          ...challenge,
          ...updatedChallenge
        });
      requestStub
        .withArgs(
          `${MFA_CHALLENGE_PATH}/${challenge.id}/token`,
          HttpMethod.POST
        )
        .resolves({
          token: confirmedToken
        });

      return { requestStub, confirmedToken, client };
    };

    describe("when challenge is verified", () => {
      it("should set and return confirmed access token", async () => {
        const { requestStub, confirmedToken, client } = setup({
          status: ChallengeStatus.VERIFIED
        });

        const response: any = await client.auth.getMFAConfirmedToken();

        expect(requestStub.callCount).to.equal(4);
        expect(response.accessToken).to.equal(confirmedToken);
        expect(client.auth.token && client.auth.token.accessToken).to.equal(
          confirmedToken
        );

        requestStub.restore();
      });
    });

    describe("when challenge is denied", () => {
      it("should throw a `Challenge denied` error", async () => {
        const { requestStub, client } = setup({
          status: ChallengeStatus.DENIED
        });
        let error;

        try {
          await client.auth.getMFAConfirmedToken();
        } catch (err) {
          error = err;
        }

        expect(requestStub.callCount).to.equal(3);
        expect(error.message).to.equal("Challenge denied");
        expect(error.name).to.equal("ChallengeDeniedError");

        requestStub.restore();
      });
    });

    describe("when challenge is expired", () => {
      it("should throw a `Challenge expired` error", async () => {
        const { requestStub, client } = setup({
          expiresAt: moment().subtract(2, "minutes")
        });
        let error;

        try {
          await client.auth.getMFAConfirmedToken();
        } catch (err) {
          error = err;
        }

        expect(requestStub.callCount).to.equal(3);
        expect(error.message).to.equal("Challenge expired");
        expect(error.name).to.equal("ChallengeExpiredError");

        requestStub.restore();
      });
    });
  });

  describe("client.auth.cancelMFAConfirmation()", () => {
    it("should cancel polling and reject the corresponding promise", async () => {
      const client = createClient();
      const requestStub = sinon.stub(client.auth, <any>"request").resolves({
        id: "35f31e77-467a-472a-837b-c34ad3c8a9b4",
        status: ChallengeStatus.PENDING,
        expiresAt: moment().add(10, "minutes")
      });
      const clearTimeoutSpy = sinon.spy(global, "clearTimeout");

      let error;
      try {
        setTimeout(() => {
          client.auth.cancelMFAConfirmation();
        }, 100);

        await client.auth.getMFAConfirmedToken();
      } catch (err) {
        error = err;
      }

      expect(clearTimeoutSpy.callCount).to.equal(1);
      expect(error.message).to.equal("MFA confirmation canceled");
      expect(error.name).to.equal("MFAConfirmationCanceledError");

      requestStub.restore();
      clearTimeoutSpy.restore();
    });
  });

  describe("client.auth.createDevice()", () => {
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
        .stub(client.auth, <any>"request")
        .resolves(createDeviceResponse);
      const result = await client.auth.createDevice(createDeviceParams);

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

  describe("client.auth.verifyDevice()", () => {
    const deviceId = "daecde61-18a4-4010-a0f7-a8b21c27996a";

    const verifyDeviceParams = {
      challengeId: "daecde61-18a4-4010-a0f7-a8b21c27996a",
      signature: "fake-signature"
    };

    it("should verify device", async () => {
      const client = createClient();
      const requestStub = sinon.stub(client.auth, <any>"request").resolves();
      const result = await client.auth.verifyDevice(
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

  describe("client.auth.createDeviceChallenge()", () => {
    const deviceId = "daecde61-18a4-4010-a0f7-a8b21c27996a";

    const createDeviceChallengeResponse = {
      id: "83d1a026-dc80-48dc-bc15-4b672716050d",
      stringToSign: "7b6ad39f-1593-4f4d-a84d-b539cc25a3cf"
    };

    it("should create device challenge", async () => {
      const client = createClient();
      const requestStub = sinon
        .stub(client.auth, <any>"request")
        .resolves(createDeviceChallengeResponse);
      const result = await client.auth.createDeviceChallenge(deviceId);

      expect(requestStub.callCount).to.equal(1);
      expect(requestStub.getCall(0).args).to.eql([
        `/api/user/devices/${deviceId}/challenges`,
        "POST"
      ]);
      expect(result).to.equal(createDeviceChallengeResponse);

      requestStub.restore();
    });
  });

  describe("client.auth.verifyDeviceChallenge()", () => {
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
        .stub(client.auth, <any>"request")
        .resolves(verifyDeviceChallengeResponse);
      const result = await client.auth.verifyDeviceChallenge(
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
      expect(client.auth.token && client.auth.token.accessToken).to.equal(
        verifyDeviceChallengeResponse.token
      );

      requestStub.restore();
    });
  });

  describe("client.auth.refreshTokenSilently()", () => {
    const origin = "http://some.url";
    const code = "some-random-code";
    (global as any).window = {};
    (global as any).document = {
      location: {
        origin
      }
    };

    it("should request a silent authorization and fetch a new token", async () => {
      const dummyToken = "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      const state = "some?state&with#uri=components";
      const client = createClient({
        state
      });
      const customTimeout = 20000;
      const tokenResponseData = {
        access_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        refresh_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1",
        token_type: "Bearer"
      };
      const oauthClient = new ClientOAuth2({});
      const fetchTokenStub = sinon
        .stub(client.auth, "fetchToken")
        .callsFake(async () => {
          return new ClientOAuth2.Token(oauthClient, tokenResponseData);
        });

      const silentAuthorizationStub = sinon
        .stub(utils, "authorizeSilently")
        .resolves(code);

      const token = await client.auth.refreshTokenSilently(customTimeout);

      expect(fetchTokenStub.callCount).to.equal(1);
      expect(fetchTokenStub.getCall(0).args[0]).to.equal(
        `${origin}?code=${code}&state=${encodeURIComponent(state)}`
      );

      expect(silentAuthorizationStub.callCount).to.equal(1);
      const [firstArg, secondArg, thirdArg] = silentAuthorizationStub.getCall(
        0
      ).args;
      expect(firstArg).to.include("prompt=none");
      expect(firstArg).to.include("response_mode=web_message");
      expect(secondArg).to.equal(Constants.KONTIST_API_BASE_URL);
      expect(thirdArg).to.equal(customTimeout);

      expect(token.accessToken).to.equal(dummyToken);

      fetchTokenStub.restore();
      silentAuthorizationStub.restore();
    });
  });
});
