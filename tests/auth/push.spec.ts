import { expect } from "chai";
import * as sinon from "sinon";
import * as moment from "moment";
import { PUSH_CHALLENGE_PATH } from "../../lib/auth/push";
import { HttpMethod, PushChallengeStatus } from "../../lib/types";

import { createClient } from "../helpers";

describe("Auth: PushNotificationMFA", () => {
  describe("client.auth.push.getConfirmedToken()", () => {
    const setup = (updatedChallenge: Object) => {
      const challenge = {
        id: "35f31e77-467a-472a-837b-c34ad3c8a9b4",
        status: PushChallengeStatus.PENDING,
        expiresAt: moment().add(10, "minutes")
      };
      const confirmedToken = "cnf-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

      const client = createClient();

      client.auth.push["challengePollInterval"] = 0;

      const requestStub = sinon.stub(client.auth.push["request"], "fetch");
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
          ...updatedChallenge
        });
      requestStub
        .withArgs(
          `${PUSH_CHALLENGE_PATH}/${challenge.id}/token`,
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
          status: PushChallengeStatus.VERIFIED
        });

        const response: any = await client.auth.push.getConfirmedToken();

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
          status: PushChallengeStatus.DENIED
        });
        let error;

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
          expiresAt: moment().subtract(2, "minutes")
        });
        let error;

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

  describe("client.auth.push.cancelConfirmation()", () => {
    it("should cancel polling and reject the corresponding promise", async () => {
      const client = createClient();
      const requestStub = sinon
        .stub(client.auth.push["request"], "fetch")
        .resolves({
          id: "35f31e77-467a-472a-837b-c34ad3c8a9b4",
          status: PushChallengeStatus.PENDING,
          expiresAt: moment().add(10, "minutes")
        });
      const clearTimeoutSpy = sinon.spy(global, "clearTimeout");

      let error;
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
