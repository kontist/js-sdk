import { expect } from "chai";
import * as sinon from "sinon";
import { CardType } from "../../lib/graphql/schema";

import { Client } from "../../lib";
import { Card } from "../../lib/graphql/card";

const cardData = {
  id: "010e5dcfdd7949fea50a510e97157168",
  status: "ACTIVE",
  type: "VISA_BUSINESS_DEBIT",
  holder: "JEAN DUPONT",
  formattedExpirationDate: "12/22",
  maskedPan: "6802********5119",
  settings: {
    contactlessEnabled: true
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
    it("should call rawQuery and return all cards details", async () => {
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
      const result = await card.fetch();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq({
        items: cardsData,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false
        }
      });
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
        id: cardData.id,
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
        id: cardData.id,
        type: CardType.MastercardBusinessDebit
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(null);
    });
  });
});
