import { expect } from "chai";
import * as sinon from "sinon";
import {
  CardAction,
  CardStatus,
  CardType,
  CaseResolution,
} from "../../lib/graphql/schema";

import { Client } from "../../lib";
import { Card } from "../../lib/graphql/card";

const cardData = {
  id: "010e5dcfdd7949fea50a510e97157168",
  status: CardStatus.Inactive,
  type: CardType.VisaBusinessDebit,
  holder: "JEAN DUPONT",
  formattedExpirationDate: "12/22",
  maskedPan: "6802********5119",
  pinSet: false,
  settings: {
    contactlessEnabled: true,
  },
  googlePayTokens: [],
  addedToApplePay: true
};

const cardLimitsData = {
  cardNotPresentLimits: {
    daily: {
      maxAmountCents: 350000,
      maxTransactions: 34,
    },
    monthly: {
      maxAmountCents: 2000000,
      maxTransactions: 777,
    },
  },
  cardPresentLimits: {
    daily: {
      maxAmountCents: 440000,
      maxTransactions: 14,
    },
    monthly: {
      maxAmountCents: 2600000,
      maxTransactions: 468,
    },
  },
};

describe("Card", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;
  const confirmationId = "71c7ecca-7763-4d9a-a54f-49924d7505f5";

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
    it("should call rawQuery and return all cards details", async () => {
      // arrange
      const cardsData = [
        cardData,
        { ...cardData, id: "010e5dcfdd7949fea50a510e97157169" },
      ];
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            cards: [
              cardData,
              { ...cardData, id: "010e5dcfdd7949fea50a510e97157169" },
            ],
          },
        },
      } as any);

      // act
      const result = await card.fetch();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq({
        items: cardsData,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
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
            card: cardData,
          },
        },
      } as any);

      // act
      const result = await card.get({
        id: cardData.id,
        type: CardType.VisaBusinessDebit,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(cardData);
    });

    it("should call rawQuery and return null for missing account", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      // act
      const result = await card.get({
        id: cardData.id,
        type: CardType.MastercardBusinessDebit,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(null);
    });
  });

  describe("#getLimits", () => {
    it("should call rawQuery and return card details", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            card: {
              settings: cardLimitsData,
            },
          },
        },
      } as any);

      // act
      const result = await card.getLimits({
        id: cardData.id,
        type: CardType.VisaBusinessDebit,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(cardLimitsData);
    });

    it("should call rawQuery and return null for missing account", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      // act
      const result = await card.get({
        id: cardData.id,
        type: CardType.MastercardBusinessDebit,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(null);
    });
  });

  describe("#create", () => {
    it("should call rawQuery and return newly created card details", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        createCard: cardData,
      } as any);

      // act
      const result = await card.create({
        type: CardType.VisaBusinessDebit,
        cardHolderRepresentation: "No Name",
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(cardData);
    });
  });

  describe("#activate", () => {
    it("should call rawQuery and return activated card", async () => {
      // arrange
      const activatedCardData = {
        ...cardData,
        status: CardStatus.Active,
      };
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        activateCard: activatedCardData,
      } as any);

      // act
      const result = await card.activate({
        id: cardData.id,
        verificationToken: "7AOXBQ",
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(activatedCardData);
    });
  });

  describe("#changePIN", () => {
    it("should call rawQuery and return confirmationId", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        changeCardPIN: {
          confirmationId,
        },
      } as any);

      // act
      const result = await card.changePIN({
        id: cardData.id,
        pin: "9164",
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(confirmationId);
    });
  });

  describe("#confirmChangePIN", () => {
    it("should call rawQuery and return status", async () => {
      // arrange
      const status = "COMPLETED";
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        confirmChangeCardPIN: {
          status,
        },
      } as any);

      // act
      const result = await card.confirmChangePIN({
        id: cardData.id,
        authorizationToken: "090402",
        confirmationId,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(status);
    });
  });

  describe("#changeStatus", () => {
    it("should call rawQuery and return updated card details", async () => {
      // arrange
      const updatedCardData = {
        ...cardData,
        status: CardStatus.Blocked,
      };
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        changeCardStatus: updatedCardData,
      } as any);

      // act
      const result = await card.changeStatus({
        id: cardData.id,
        action: CardAction.Block,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(updatedCardData);
    });
  });

  describe("#updateSettings", () => {
    it("should call rawQuery and return updated card details", async () => {
      // arrange
      const updatedCardSettings = {
        contactlessEnabled: false,
        ...cardLimitsData,
      };
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        updateCardSettings: updatedCardSettings,
      } as any);

      // act
      const result = await card.updateSettings({
        id: cardData.id,
        ...updatedCardSettings,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(updatedCardSettings);
    });
  });

  describe("#replace", () => {
    it("should call rawQuery and return updated card details", async () => {
      // arrange;
      const newCardData = {
        ...cardData,
        status: CardStatus.Processing
      };
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        replaceCard: newCardData
      } as any);

      // act
      const result = await card.replace({
        id: cardData.id
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(newCardData);
    });
  });

  describe("#reorder", () => {
    it("should call rawQuery and return newly created card details", async () => {
      // arrange;
      const newCardData = {
        ...cardData,
        status: CardStatus.Processing
      };
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        reorderCard: newCardData
      } as any);

      // act
      const result = await card.reorder({
        id: cardData.id
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(newCardData);
    });
  });

  describe("#setCardHolderRepresentation", () => {
    it("should call rawQuery and return the new card holder representation", async () => {
      // arrange;
      const cardHolderRepresentation = "JOHN/LENNON";
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        setCardHolderRepresentation: cardHolderRepresentation
      } as any);

      // act
      const result = await card.setCardHolderRepresentation(cardHolderRepresentation);

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(spyOnRawQuery.getCall(0).args[1]).to.eql({ cardHolderRepresentation });
      expect(result).to.eq(cardHolderRepresentation);
    });
  });

  describe("#addGooglePayCardToken", () => {
    it("should call rawQuery and return the Google Pay card token", async () => {
      // arrange;
      const walletId = "Rwt3tJek_k1JxivcwbPHjKDk";
      const tokenRefId = "DNITHE382012542083412345";
      const args = {
        walletId,
        tokenRefId,
        id: cardData.id,
      };
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        addGooglePayCardToken: {
          walletId,
          tokenRefId,
        },
      } as any);

      // act
      const result = await card.addGooglePayCardToken(args);

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(spyOnRawQuery.getCall(0).args[1]).to.eql(args);
      expect(result).to.eql({
        walletId,
        tokenRefId,
      });
    });
  });

  describe("#deleteGooglePayCardToken", () => {
    it("should call rawQuery and return the Google Pay card token", async () => {
      // arrange;
      const walletId = "Rwt3tJek_k1JxivcwbPHjKDk";
      const tokenRefId = "DNITHE382012542083412345";
      const args = {
        walletId,
        tokenRefId,
        id: cardData.id,
      };
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        deleteGooglePayCardToken: {
          walletId,
          tokenRefId,
        },
      } as any);

      // act
      const result = await card.deleteGooglePayCardToken(args);

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(spyOnRawQuery.getCall(0).args[1]).to.eql(args);
      expect(result).to.eql({
        walletId,
        tokenRefId,
      });
    });
  });

  describe("#whitelistCard", () => {
    it("should call rawQuery and return WhitelistCardResponse", async () => {
      // arrange;
      const response = {
        id: cardData.id,
        resolution: CaseResolution.Whitelisted,
        whitelistedUntil: new Date().toISOString(),
      };

      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        whitelistCard: response,
      } as any);

      // act
      const result = await card.whitelistCard();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eql(response);
    });
  });

  describe("#confirmFraud", () => {
    it("should call rawQuery and return ConfirmFraudResponse", async () => {
      // arrange;
      const response = {
        id: cardData.id,
        resolution: CaseResolution.Confirmed,
      };

      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        confirmFraud: response,
      } as any);

      // act
      const result = await card.confirmFraud();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eql(response);
    });
  });
});
