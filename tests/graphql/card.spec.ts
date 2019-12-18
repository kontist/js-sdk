import { expect } from "chai";
import * as sinon from "sinon";
import { CardType } from "../../lib/graphql/schema";

import { Client } from "../../lib";
import { Card } from "../../lib/graphql/card";
import { KontistSDKError } from "../../lib/errors";

const cardData = {
  id: "010e5dcfdd7949fea50a510e97157168",
  status: "ACTIVE",
  type: "VISA_BUSINESS_DEBIT",
  canceledAt: null,
  expirationDate: "2022-12-18T00:00:00.000Z",
  orderedAt: "2019-12-18T08:23:52.898Z",
  holder: "JEAN DUPONT",
  formattedExpirationDate: "12/22",
  maskedPan: "6802********5119",
  settings: {
    contactlessEnabled: true,
    cardNotPresentLimits: {
      daily: {
        maxAmountCents: 150000,
        maxTransactions: 25
      },
      monthly: {
        maxAmountCents: 1000000,
        maxTransactions: 775
      }
    },
    cardPresentLimits: {
      daily: {
        maxAmountCents: 450000,
        maxTransactions: 15
      },
      monthly: {
        maxAmountCents: 2500000,
        maxTransactions: 465
      }
    }
  }
};

describe("Card", () => {
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
      state
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("#fetch", () => {
    it("should fail", async () => {
      // arrange
      const account = new Card(client.graphQL);

      // act
      let error;
      try {
        await account.fetch();
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).to.be.an.instanceOf(KontistSDKError);
      expect(error.message).to.eq(
        "Card model does not implement fetch, please use the `get` method instead."
      );
    });
  });

  describe("#get", () => {
    it("should call rawQuery and return card details", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            card: cardData
          }
        }
      } as any);

      // act
      const result = await card.get({
        cardId: cardData.id,
        type: CardType.VisaBusinessDebit
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(cardData);
    });

    it("should call rawQuery and return null for missing account", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {}
      } as any);

      // act
      const result = await card.get({
        cardId: cardData.id,
        type: CardType.MastercardBusinessDebit
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(null);
    });
  });

  describe("#getAll", () => {
    it("should call rawQuery and return an array of card details", async () => {
      // arrange
      const cardsData = [
        cardData,
        { ...cardData, id: "010e5dcfdd7949fea50a510e97157169" }
      ];
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            cards: [
              cardData,
              { ...cardData, id: "010e5dcfdd7949fea50a510e97157169" }
            ]
          }
        }
      } as any);

      // act
      const result = await card.getAll();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(cardsData);
    });

    it("should call rawQuery and return null for missing account", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {}
      } as any);

      // act
      const result = await card.getAll();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(null);
    });
  });
});
