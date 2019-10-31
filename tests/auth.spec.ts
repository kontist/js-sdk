import { expect } from "chai";
import { Client, Constants } from "../lib";
import * as sinon from "sinon";
import ClientOAuth2 = require("client-oauth2");

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
});
