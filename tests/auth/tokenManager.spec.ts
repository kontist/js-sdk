import * as sinon from "sinon";
import { expect } from "chai";
import ClientOAuth2 = require("client-oauth2");

import { Client, Constants } from "../..";
import { clientId, createClient, redirectUri } from "../helpers";
import { utils } from "../../utils";

describe("Auth: TokenManager", () => {
  const verifier = "Huag6ykQU7SaEYKtmNUeM8txt4HzEIfG";
  const clientSecret = "very-secret";

  describe("#getAuthUri", () => {
    it("should return proper redirect url when clientSecret is provided", async () => {
      const client = createClient({ clientSecret });
      const url = await client.auth.tokenManager.getAuthUri();
      const searchParams = new URLSearchParams(new URL(url).search);
      expect(
        url.startsWith(`${Constants.KONTIST_API_BASE_URL}/api/oauth/authorize?`)
      ).to.equal(true);
      expect(searchParams.get("client_id")).to.equal(clientId);
      expect(searchParams.get("redirect_uri")).to.equal(
        "https://localhost:3000/auth/callback"
      );
      expect(searchParams.get("response_type")).to.equal("code");
      expect(searchParams.get("state")).to.equal("25843739712322056");
      expect(searchParams.get("scope")).to.equal("transactions");
      expect(searchParams.get("code_challenge")).to.equal(null);
      expect(searchParams.get("code_challenge_method")).to.equal(null);
    });

    it("should return proper redirect url when code verifier is provided", async () => {
      const client = createClient({ verifier });
      const codeChallenge = "xc3uY4-XMuobNWXzzfEqbYx3rUYBH69_zu4EFQIJH8w";
      const codeChallengeMethod = "S256";
      const url = await client.auth.tokenManager.getAuthUri();
      const searchParams = new URLSearchParams(new URL(url).search);
      expect(
        url.startsWith(`${Constants.KONTIST_API_BASE_URL}/api/oauth/authorize?`)
      ).to.equal(true);
      expect(searchParams.get("client_id")).to.equal(clientId);
      expect(searchParams.get("redirect_uri")).to.equal(
        "https://localhost:3000/auth/callback"
      );
      expect(searchParams.get("response_type")).to.equal("code");
      expect(searchParams.get("state")).to.equal("25843739712322056");
      expect(searchParams.get("scope")).to.equal("transactions");
      expect(searchParams.get("code_challenge")).to.equal(codeChallenge);
      expect(searchParams.get("code_challenge_method")).to.equal(
        codeChallengeMethod
      );
    });
  });

  describe("#fetchToken", () => {
    const callbackUrl = `${redirectUri}?code=a253a28a749cb31e7ba7487b9e240b53f6783317&state=25843739712322056`;
    const tokenResponseData = {
      access_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      refresh_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1",
      token_type: "Bearer",
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
        tokenData = await client.auth.tokenManager.fetchToken(callbackUrl);
      });

      it("should call oauthClient.code.getToken() with proper arguments", () => {
        const stub = oauthClient.code.getToken as sinon.SinonStub;
        const [url, opts] = stub.getCall(0).args;
        expect(url).to.equal(callbackUrl);
        expect(opts).to.deep.equal({
          body: {
            code_verifier: verifier,
          },
        });
      });

      it("should return token data", () => {
        expect(tokenData.data).to.deep.equal(tokenResponseData);
      });
    });

    describe("for client secret", () => {
      beforeEach(async () => {
        const client = createClient({ clientSecret, oauthClient });
        tokenData = await client.auth.tokenManager.fetchToken(callbackUrl);
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

  describe("#fetchTokenFromCredentials", () => {
    const username = "user@kontist.com";
    const password = "test1234";
    const scopes = ["transfers"];

    const tokenResponseData = {
      access_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
      token_type: "Bearer",
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
      await client.auth.tokenManager.fetchTokenFromCredentials({
        username,
        password,
      });

      const stub = oauthClient.owner.getToken as sinon.SinonStub;
      const args = stub.getCall(0).args;
      expect(args).to.deep.equal([username, password, {}]);
    });

    it("should return token data", async () => {
      const tokenData =
        await client.auth.tokenManager.fetchTokenFromCredentials({
          username,
          password,
        });

      expect(tokenData.data).to.deep.equal(tokenResponseData);
    });

    it("should forward `scopes` to oauthClient.owner.getToken() when set", async () => {
      await client.auth.tokenManager.fetchTokenFromCredentials({
        username,
        password,
        scopes,
      });

      const stub = oauthClient.owner.getToken as sinon.SinonStub;
      const args = stub.getCall(0).args;
      expect(args).to.deep.equal([username, password, { scopes }]);
    });
  });

  describe("#refresh", () => {
    describe("when client is created with a verifier", () => {
      const origin = "http://some.url";
      const code = "some-random-code";

      beforeEach(() => {
        (global as any).window = {};
        (global as any).document = {
          location: {
            origin,
          },
        };
      });

      it("should request a silent authorization and fetch a new token", async () => {
        const dummyToken = "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
        const state = "some?state&with#uri=components";
        const client = createClient({
          verifier,
          state,
        });
        const customTimeout = 20000;
        const tokenResponseData = {
          access_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
          token_type: "Bearer",
        };
        const oauthClient = new ClientOAuth2({});
        const fetchTokenStub = sinon
          .stub(client.auth.tokenManager, "fetchToken")
          .callsFake(async () => {
            return new ClientOAuth2.Token(oauthClient, tokenResponseData);
          });

        const silentAuthorizationStub = sinon
          .stub(utils, "authorizeSilently")
          .resolves(code);

        const token = await client.auth.tokenManager.refresh(customTimeout);

        expect(fetchTokenStub.callCount).to.equal(1);
        expect(fetchTokenStub.getCall(0).args[0]).to.equal(
          `${origin}?code=${code}&state=${encodeURIComponent(state)}`
        );

        expect(silentAuthorizationStub.callCount).to.equal(1);
        const [firstArg, secondArg, thirdArg] =
          silentAuthorizationStub.getCall(0).args;
        expect(firstArg).to.include("prompt=none");
        expect(firstArg).to.include("response_mode=web_message");
        expect(secondArg).to.equal(Constants.KONTIST_API_BASE_URL);
        expect(thirdArg).to.equal(customTimeout);

        expect(token.accessToken).to.equal(dummyToken);

        fetchTokenStub.restore();
        silentAuthorizationStub.restore();
      });

      afterEach(() => {
        (global as any).window = undefined;
        (global as any).document = undefined;
      });
    });

    describe("when client is created with a clientSecret", () => {
      it("should request a new token using refresh token", async () => {
        const oauthClient = new ClientOAuth2({});

        const client = createClient({
          oauthClient,
          clientSecret,
        });

        const tokenResponseData = {
          access_token:
            "dummy-access-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
          refresh_token:
            "dummy-refresh-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1",
          token_type: "Bearer",
        };

        client.auth.tokenManager.setToken(
          tokenResponseData.access_token,
          tokenResponseData.refresh_token
        );

        const clientOAuth2TokenRefreshStub = sinon
          .stub(ClientOAuth2.Token.prototype, "refresh")
          .callsFake(async () => {
            return new ClientOAuth2.Token(oauthClient, tokenResponseData);
          });

        await client.auth.tokenManager.refresh();

        expect(clientOAuth2TokenRefreshStub.callCount).to.equal(1);

        clientOAuth2TokenRefreshStub.restore();
      });
    });
  });

  describe("#setToken", () => {
    it("should be able to set access token", () => {
      const client = createClient({ clientSecret });
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNThmNzg5Ny03YzdlLTQzMWItYTY2MS0yMDYzNjE0YzM0YTYiLCJzY29wZSI6InRyYW5zYWN0aW9ucyIsImNsaWVudF9pZCI6IjI2OTkwMjE2LWUzNDAtNGY1NC1iNWE1LWRmOWJhYWNjMDQ0MSIsImlhdCI6MTU3MTMyNzYwOSwiZXhwIjoxNTcxMzMxMjA5fQ.JrDN1w5bh43QgV3buXQSlD5utk74NIXbOGETFPMJH6A";
      const refreshToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNThmNzg5Ny03YzdlLTQzMWItYTY2MS0yMDYzNjE0YzM0YTYiLCJzY29wZSI6InJlZnJlc2ggdHJhbnNhY3Rpb25zIiwiY2xpZW50X2lkIjoiMjY5OTAyMTYtZTM0MC00ZjU0LWI1YTUtZGY5YmFhY2MwNDQxIiwiaWF0IjoxNTcxMzI3NjA5LCJleHAiOjE1NzEzMzQ4MDl9.HWSA7hB54WEznBaWzvZKwd_fXuLBQqD0kHugidkzW4U";
      const tokenType = "bearer";

      let token = client.auth.tokenManager.setToken(accessToken);
      expect(token.accessToken).to.equal(accessToken);

      token = client.auth.tokenManager.setToken(accessToken, refreshToken);
      expect(token.accessToken).to.equal(accessToken);
      expect(token.refreshToken).to.equal(refreshToken);

      token = client.auth.tokenManager.setToken(
        accessToken,
        refreshToken,
        tokenType
      );
      expect(token.accessToken).to.equal(accessToken);
      expect(token.refreshToken).to.equal(refreshToken);
      expect(token.tokenType).to.equal(tokenType);
    });
  });
});
