import { expect } from "chai";
import { Client, Constants } from "../lib";
import * as sinon from "sinon";
import ClientOAuth2 = require("client-oauth2");

describe("OAuth2 client tests", () => {
  const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
  const redirectUri = "https://localhost:3000/auth/callback";
  const scopes = ["transactions"];

  let sandbox: sinon.SinonSandbox;

  before(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(Math, "random").returns(0.25843739712322056);
  });

  after(() => {
    sandbox.restore();
  });

  describe("client with mandatory parameters", () => {
    let client: Client;

    beforeEach(() => {
      client = new Client({
        clientId,
        redirectUri,
        scopes
      });
    });

    it("should be able to create a client", () => {
      expect(client).to.exist;
    });

    describe("client.getAuthUri()", () => {
      it("should return proper redirect url", async () => {
        const url = await client.getAuthUri();
        const expectedUrl = `${Constants.KONTIST_API_BASE_URL}/api/oauth/authorize?client_id=${clientId}&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scope=transactions&response_type=code&state=25843739712322056`;
        expect(url).to.equal(expectedUrl);
      });

      it("should return proper redirect url when codeChallenge and codeChallengeMethod are provided", async () => {
        const codeChallenge = "xc3uY4-XMuobNWXzzfEqbYx3rUYBH69_zu4EFQIJH8w";
        const codeChallengeMethod = "S256";
        const url = await client.getAuthUri({
          codeChallenge,
          codeChallengeMethod
        });
        const expectedUrl = `${Constants.KONTIST_API_BASE_URL}/api/oauth/authorize?client_id=${clientId}&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scope=transactions&response_type=code&state=25843739712322056&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;
        expect(url).to.equal(expectedUrl);
      });
    });

    describe("client.getToken()", () => {
      const oauth2PKCECodeVerifier = "Huag6ykQU7SaEYKtmNUeM8txt4HzEIfG";
      const callbackUrl = `${redirectUri}?code=a253a28a749cb31e7ba7487b9e240b53f6783317&state=25843739712322056`;
      const tokenResponseData = {
        access_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        refresh_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1",
        token_type: "Bearer"
      };
      let oauthClient: ClientOAuth2;
      let tokenData: ClientOAuth2.Token;

      beforeEach(async () => {
        oauthClient = new ClientOAuth2({});

        sinon.stub(oauthClient.code, "getToken").callsFake(async () => {
          return new ClientOAuth2.Token(oauthClient, tokenResponseData);
        });

        const clientMock = new Client({
          clientId,
          oauthClient,
          redirectUri,
          scopes
        });

        tokenData = await clientMock.getToken(callbackUrl, {
          codeVerifier: oauth2PKCECodeVerifier
        });
      });

      it("should call oauthClient.code.getToken() with proper arguments", () => {
        const stub = oauthClient.code.getToken as sinon.SinonStub;
        const [url, opts] = stub.getCall(0).args;
        expect(url).to.equal(callbackUrl);
        expect(opts).to.deep.equal({
          state: "25843739712322056",
          body: {
            code_verifier: oauth2PKCECodeVerifier
          }
        });
      });

      it("should return token data", () => {
        expect(tokenData.data).to.deep.equal(tokenResponseData);
      });
    });
  });
});