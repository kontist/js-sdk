import { expect } from "chai";
import * as sinon from "sinon";
import ClientOAuth2 = require("client-oauth2");
import { Constants } from "../../lib";
import * as utils from "../../lib/utils";

import { createClient } from "../helpers";

describe("Auth: TokenManager", () => {
  const verifier = "Huag6ykQU7SaEYKtmNUeM8txt4HzEIfG";
  const clientSecret = "very-secret";

  describe("client.auth.tokenManager.refresh()", () => {
    describe("when client is created with a verifier", () => {
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
          verifier,
          state
        });
        const customTimeout = 20000;
        const tokenResponseData = {
          access_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
          token_type: "Bearer"
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

    describe("when client is created with a clientSecret", () => {
      it("should request a new token using refresh token", async () => {
        const oauthClient = new ClientOAuth2({});

        const client = createClient({
          oauthClient,
          clientSecret
        });

        const tokenResponseData = {
          access_token:
            "dummy-access-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
          refresh_token:
            "dummy-refresh-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1",
          token_type: "Bearer"
        };

        client.auth.setToken(
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
});
