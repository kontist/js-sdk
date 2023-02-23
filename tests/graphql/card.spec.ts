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
  addedToApplePay: true,
};

const cardLimitsData = {
  cardSpendingLimits: {
    atm: {
      daily: {
        maxAmountCents: 440000,
        maxTransactions: 14,
      },
      monthly: {
        maxAmountCents: 2600000,
        maxTransactions: 468,
      },
    },
    purchase: {
      daily: {
        maxAmountCents: 440000,
        maxTransactions: 14,
      },
      monthly: {
        maxAmountCents: 2600000,
        maxTransactions: 468,
      },
    },
  },
};

const cardPinKeyData = {
  kid: "0dce6f4d-b5d0-4c7b-a7d8-cfe231a1f385",
  kty: "RSA",
  use: "enc",
  alg: "RS256",
  n: "ielfymjYSKEeeai7pFBhJrr0aR-B5_T0snVgQSm8K-SsFv3MFofkeWxWT3PCBId8kovdI-gfKabCyhuQDaYbXP1opyEkB9-gyG4zqmWoW9ddmWo-wxaW08KiruNl09IjWJR0w93tM0i8Pn2qpCSM3h0CdgfO9-VjLn1BpYFKjuJ1apZQ3TG1YYIfGSymghUl0JWLu0s5J2BrvEz91E0K4aF-VY4oSnlrTilq3FrCOgF8IopUvqJWIsz-hKagNAP1K4AXoSVX7Kc4MxUcZEIlkeMKj05YF3zoFhOzfQCa5kcYdPFNlEOpuZwuMidYw8LNBFdvV4VeKYUXZrvaW-SKUQ",
  e: "AQAB",
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

  describe("#getPinKey", () => {
    it("should call rawQuery and return PIN key", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            card: {
              pinKey: cardPinKeyData,
            },
          },
        },
      } as any);

      // act
      const result = await card.getPinKey({
        id: cardData.id,
        type: CardType.VisaBusinessDebit,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(cardPinKeyData);
    });

    it("should call rawQuery and return null for missing account", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      // act
      const result = await card.getPinKey({
        id: cardData.id,
        type: CardType.MastercardBusinessDebit,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(null);
    });
  });

  describe("#changePINEncrypted", () => {
    it("should call rawQuery and return card details", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        changeCardPINEncrypted: cardData,
      } as any);

      // act
      const result = await card.changePINEncrypted({
        id: cardData.id,
        payload: {
          encryptedPin:
            "Web;7d2cf82ae5774e5293e4c020d2381217dcon;jVl14emA+OcyALb9F+CMFg==;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",
          keyId: "0dce6f4d-b5d0-4c7b-a7d8-cfe231a1f385",
          deviceId: "d3768ef3-b26b-4746-9ee0-94f527184830",
          signature:
            "3045022100ef4f8ede9999e1338a2af0ecd5c183c306fc1d134302895aa813bd0434b0a5d90220567e1c5d16d6be0f3a8553fcfdd765e8fefb169532fbf6932d96075358b46328",
        },
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(cardData);
    });
  });

  describe("#changePINWithChangeRequest", () => {
    it("should call rawQuery and return card details", async () => {
      // arrange
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        changeCardPINWithChangeRequest: { confirmationId },
      } as any);

      // act
      const result = await card.changePINWithChangeRequest({
        id: cardData.id,
        payload: {
          encryptedPin:
            "eyJhbGciOiJSU0EtT0FFUCIsImVuYyI6IkExMjhDQkMtSFMyNTYiLCJ0eXAiOiJKV1QiLCJhbHBoYSI6dHJ1ZX0.ESmAsi_RKsvRnGdlXxGcRZ-ZZc-BTsiKelWb2IvR4p630N2-mefal4LQAy-Fb1QqhmXDaR_uo0IwAbLDOPDH4oDYF-VjbzDsYyG_hjP9Qx6HIdAThuCS1NP8T_7ktT8XNTiS43i3RKEfajbaJS6EM9coV7nBNf--wJz_IpEKLzSPF0nwdljTZzdrl7-o8TWvkzI2edJx4053iIQ3rnfkV0nV2MW1ozWykBk_-53b9u-rew-EHRQI79TVvzR7L0E8Xi8NOaj5jOi-fnMQbW20sv0ATZQ3vptFdarRZcVKRMe2s9ZCIaN0al4-DHWvbnl6uIncxObbeKM923X_KaQ-LQ.lacxJCgDnYUOtHzfe4StBw.-LWGcrFLoCJmurDcFa470VmS_VYC12dPne1c2jpsvuHXR3zmFPRz7_o5k1BPeiYf4nlWWK2OP4gYyv10lcLCyoSTh_t_kL7mS-ZkEjzccz5USFL8FxbOtSpmhyajGgvDQhCNteTFwkETF0KX-EyoauVhz-d1ZO1V-RP-maIAeiUDAEVOv3ZbMSoDl0PoTg7jhVswEgLuCNMrQI8Chzu0AxEYwRWeV3xUBbtieEIGeA1orp4eWbVWgKnnlF5Xhm2L.EGX9RuRsUBEZM6U5ZHZyCg",
          keyId: "0dce6f4d-b5d0-4c7b-a7d8-cfe231a1f385",
        },
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(confirmationId);
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
        status: CardStatus.Processing,
      };
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        replaceCard: newCardData,
      } as any);

      // act
      const result = await card.replace({
        id: cardData.id,
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
        status: CardStatus.Processing,
      };
      const card = new Card(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        reorderCard: newCardData,
      } as any);

      // act
      const result = await card.reorder({
        id: cardData.id,
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
        setCardHolderRepresentation: cardHolderRepresentation,
      } as any);

      // act
      const result = await card.setCardHolderRepresentation(
        cardHolderRepresentation
      );

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(spyOnRawQuery.getCall(0).args[1]).to.eql({
        cardHolderRepresentation,
      });
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
