import * as moment from "moment";
import * as sinon from "sinon";

import { HttpMethod, PushChallengeStatus } from "../../lib/types";

import { PUSH_CHALLENGE_PATH } from "../../lib/auth/push";
import { createClient } from "../helpers";
import { expect } from "chai";

interface TokenResponse {
  confirmedAccessToken?: string;
  confirmedRefreshToken?: string;
}

describe("Auth: PushNotificationMFA", () => {
  describe("#getConfirmedToken", () => {
    const setup = (
      updatedChallenge: Object,
      {
        confirmedAccessToken = "cnf-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        confirmedRefreshToken,
      }: TokenResponse = {},
    ) => {
      const challenge = {
        id: "35f31e77-467a-472a-837b-c34ad3c8a9b4",
        status: PushChallengeStatus.PENDING,
        expiresAt: moment().add(10, "minutes"),
      };

      const client = createClient();

      (client.auth.push as any).challengePollInterval = 0;

      const requestStub = sinon.stub((client.auth.push as any).request, "fetch");
      requestStub
        .withArgs(PUSH_CHALLENGE_PATH, HttpMethod.POST)
        .resolves(challenge);
      requestStub
        .withArgs(`${PUSH_CHALLENGE_PATH}/${challenge.id}`, HttpMethod.GET)
        .onFirstCall()
        .resolves(challenge)
        .onSecondCall()
        .resolves({
          ...challenge,
          ...updatedChallenge,
        });
      requestStub
        .withArgs(
          `${PUSH_CHALLENGE_PATH}/${challenge.id}/token`,
          HttpMethod.POST,
        )
        .resolves({
          token: confirmedAccessToken,
          ...(confirmedRefreshToken
            ? { refresh_token: confirmedRefreshToken }
            : {}),
        });

      return { requestStub, confirmedAccessToken, client };
    };

    describe("when challenge is verified", () => {
      it("should set and return confirmed access token", async () => {
        const { requestStub, confirmedAccessToken, client } = setup({
          status: PushChallengeStatus.VERIFIED,
        });

        const response: any = await client.auth.push.getConfirmedToken();

        expect(requestStub.callCount).to.equal(4);
        expect(response.accessToken).to.equal(confirmedAccessToken);
        expect(response.refreshToken).to.be.undefined;
        expect(
          client.auth.tokenManager.token &&
            client.auth.tokenManager.token.accessToken,
        ).to.equal(confirmedAccessToken);

        requestStub.restore();
      });
    });

    describe("when challenge is verified and a refresh token is returned", () => {
      it("should set and return confirmed access token", async () => {
        const confirmedRefreshToken = "sample-confirmed-refresh-token";
        const { requestStub, confirmedAccessToken, client } = setup(
          {
            status: PushChallengeStatus.VERIFIED,
          },
          {
            confirmedRefreshToken,
          },
        );

        const response: any = await client.auth.push.getConfirmedToken();

        expect(requestStub.callCount).to.equal(4);
        expect(response.accessToken).to.equal(confirmedAccessToken);
        expect(response.refreshToken).to.equal(confirmedRefreshToken);
        expect(
          client.auth.tokenManager.token &&
            client.auth.tokenManager.token.accessToken,
        ).to.equal(confirmedAccessToken);

        requestStub.restore();
      });
    });

    describe("when challenge is denied", () => {
      it("should throw a `Challenge denied` error", async () => {
        const { requestStub, client } = setup({
          status: PushChallengeStatus.DENIED,
        });
        let error: any;

        try {
          await client.auth.push.getConfirmedToken();
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
          expiresAt: moment().subtract(2, "minutes"),
        });
        let error: any;

        try {
          await client.auth.push.getConfirmedToken();
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

  describe("#cancelConfirmation", () => {
    it("should cancel polling and reject the corresponding promise", async () => {
      const client = createClient();
      const requestStub = sinon
        .stub((client.auth.push as any).request, "fetch")
        .resolves({
          id: "35f31e77-467a-472a-837b-c34ad3c8a9b4",
          status: PushChallengeStatus.PENDING,
          expiresAt: moment().add(10, "minutes"),
        });
      const clearTimeoutSpy = sinon.spy(global, "clearTimeout");

      let error: any;
      try {
        setTimeout(() => {
          client.auth.push.cancelConfirmation();
        }, 100);

        await client.auth.push.getConfirmedToken();
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
});
