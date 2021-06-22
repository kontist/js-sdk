import { expect } from "chai";
import * as sinon from "sinon";

import { Client } from "../../lib";
import { KontistSDKError } from "../../lib/errors";
import { Account } from "../../lib/graphql/account";

const accountStatsData = {
  accountBalance: 1378096,
  main: 1189817,
  yours: 1184262,
  unknown: 5555,
  vatAmount: -188279,
  vatTotal: 188279,
  vatMissing: 0,
  taxCurrentYearAmount: 0,
  taxPastYearsAmount: null,
  taxTotal: 0,
  taxMissing: 0,
}

describe("Account", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
    const redirectUri = "https://localhost:3000/auth/callback";
    const scopes = ["transactions"];
    const state = "25843739712322056";

    client = new Client({
      clientId,
      redirectUri,
      scopes,
      state,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("#fetch", () => {
    it("should fail", async () => {
      // arrange
      const account = new Account(client.graphQL);

      // act
      let error;
      try {
        await account.fetch();
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).to.be.an.instanceOf(KontistSDKError);
      expect(error.message).to.eq("You are allowed only to fetch your account details.");
    });
  });

  describe("#get", () => {
    it("should call rawQuery and return mainAccount", async () => {
      // arrange
      const account = new Account(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            iban: "DE1234",
            bic: "SOBKDEBBXXX",
            balance: 1234,
            availableBalance: 1000,
            cardHolderRepresentation: null,
            cardHolderRepresentations: ["STEPHEN/JAMES"],
            hasPendingCardFraudCase: false,
            canCreateOverdraft: true,
            pendingTransactionVerification: null,
          },
        },
      } as any);

      // act
      const result = await account.get();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result?.iban).to.eq("DE1234");
      expect(result?.bic).to.eq("SOBKDEBBXXX");
      expect(result?.balance).to.eq(1234);
      expect(result?.cardHolderRepresentation).to.eq(null);
      expect(result?.cardHolderRepresentations[0]).to.eq("STEPHEN/JAMES");
      expect(result?.hasPendingCardFraudCase).to.eq(false);
      expect(result?.canCreateOverdraft).to.eq(true); 
      expect(result?.pendingTransactionVerification).to.eq(null);
    });

    it("should call rawQuery and return null for empty account", async () => {
      // arrange
      const account = new Account(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      // act
      const result = await account.get();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(null);
    });
  });

  describe("#getStats", () => {
    it("should call rawQuery and return correct stats", async () => {
      // arrange
      const account = new Account(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            stats: accountStatsData,
          },
        },
      } as any);

      // act
      const result = await account.getStats();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(accountStatsData);
    });

    it("should call rawQuery and return null for missing account", async () => {
      // arrange
      const account = new Account(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      // act
      const result = await account.getStats();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(null);
    });
  });
});
