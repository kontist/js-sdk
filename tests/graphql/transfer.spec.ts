import { expect } from "chai";
import * as sinon from "sinon";
import { Transfer as TransferClass } from "../../lib/graphql/transfer";
import {
  TransferType,
  Transfer,
  StandingOrderReoccurrenceType,
  TransactionCategory,
  CreateTransferInput,
  UnfinishedTransfer,
  DeliveryMethod,
} from "../../lib/graphql/schema";
import { createTransfer, generatePaginatedResponse } from "../helpers";

describe("Transfer", () => {
  let graphqlClientStub: { rawQuery: sinon.SinonStub };
  let transferInstance: TransferClass;
  let result: any;
  const deviceId = "device-id";
  const deliveryMethod = DeliveryMethod.DeviceSigning;

  before(() => {
    graphqlClientStub = {
      rawQuery: sinon.stub(),
    };
    transferInstance = new TransferClass(graphqlClientStub as any);
  });

  describe("#createOne", () => {
    const transfer: CreateTransferInput = {
      amount: 1,
      purpose: "money1",
      e2eId: "e2e-1",
      reoccurrence: StandingOrderReoccurrenceType.Annually,
      lastExecutionDate: "2022-02-01",
      recipient: "r1",
      iban: "iban1",
    };
    const createTransferResult = {
      confirmationId: 100,
      stringToSign: "string-to-sign",
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        createTransfer: createTransferResult,
      });
      result = await transferInstance.createOne({
        transfer,
        deviceId,
        deliveryMethod,
      });
    });

    it("should send createOne GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("createTransfer");
      expect(variables).to.eql({ transfer, deviceId, deliveryMethod });
    });

    it("should return confirmTransfers result", () => {
      expect(result).to.eql(createTransferResult);
    });
  });

  describe("#confirmOne", () => {
    const confirmationId = "id-stub";
    const authorizationToken = "token";
    const confirmTransferResult = {
      __stub__: "confirmTransferResult",
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        confirmTransfer: confirmTransferResult,
      });
      result = await transferInstance.confirmOne({
        confirmationId,
        authorizationToken,
      });
    });

    it("should send confirmOne GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("confirmTransfer");
      expect(variables).to.eql({
        confirmationId,
        authorizationToken,
        deviceId: undefined,
        signature: undefined,
      });
    });

    it("should return confirmTransfer result", () => {
      expect(result).to.eql(confirmTransferResult);
    });
  });

  describe("#createMany", () => {
    const transfers: CreateTransferInput[] = [
      {
        amount: 1,
        purpose: "money1",
        e2eId: "e2e-1",
        reoccurrence: StandingOrderReoccurrenceType.Annually,
        lastExecutionDate: "2022-02-01",
        recipient: "r1",
        iban: "iban1",
      },
      {
        amount: 2,
        purpose: "money2",
        e2eId: "e2e-2",
        reoccurrence: StandingOrderReoccurrenceType.EverySixMonths,
        lastExecutionDate: "2022-02-02",
        recipient: "r2",
        iban: "iban2",
      },
    ];
    const createTransfersResult = {
      confirmationId: 100,
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        createTransfers: createTransfersResult,
      });
      result = await transferInstance.createMany(transfers);
    });

    it("should send createMany GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("createTransfers");
      expect(variables).to.eql({ transfers });
    });

    it("should return confirmTransfers result", () => {
      expect(result).to.eql(100);
    });
  });

  describe("#confirmMany", () => {
    const confirmationId = "id-stub";
    const authorizationToken = "token";
    const confirmTransfersResult = {
      __stub__: "confirmTransfersResult",
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        confirmTransfers: confirmTransfersResult,
      });
      result = await transferInstance.confirmMany(
        confirmationId,
        authorizationToken
      );
    });

    it("should send confirmMany GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("confirmTransfers");
      expect(variables).to.eql({ confirmationId, authorizationToken });
    });

    it("should return confirmTransfers result", () => {
      expect(result).to.eql(confirmTransfersResult);
    });
  });

  describe("#cancelTransfer", () => {
    const id = "id-stub";
    const type = TransferType.StandingOrder;
    const cancelTransferResult = {
      __stub__: "cancelTransferResult",
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        cancelTransfer: cancelTransferResult,
      });
      result = await transferInstance.cancelTransfer({ type, id });
    });

    it("should send cancelTransfer GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("cancelTransfer");
      expect(variables).to.eql({
        type,
        id,
        deliveryMethod: undefined,
        deviceId: undefined,
      });
    });

    it("should return cancelTransfer result", () => {
      expect(result).to.eql(cancelTransferResult);
    });
  });

  describe("#confirmCancelTransfer", () => {
    const type = TransferType.StandingOrder;
    const confirmationId = "confirmation-id-stub";
    const authorizationToken = "authorization-token-stub";
    const confirmCancelTransferResult = {
      __stub__: "confirmCancelTransferResult",
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        confirmCancelTransfer: confirmCancelTransferResult,
      });
      result = await transferInstance.confirmCancelTransfer({
        type,
        confirmationId,
        authorizationToken,
      });
    });

    it("should send confirmCancelTransfer GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("confirmCancelTransfer");
      expect(variables).to.eql({
        type,
        confirmationId,
        authorizationToken,
        deviceId: undefined,
        signature: undefined,
      });
    });

    it("should return confirmCancelTransfer result", () => {
      expect(result).to.eql(confirmCancelTransferResult);
    });
  });

  describe("iterator", () => {
    let firstTransfer: Transfer;
    let secondTransfer: Transfer;
    let thirdTransfer: Transfer;

    beforeEach(() => {
      graphqlClientStub.rawQuery.reset();

      firstTransfer = createTransfer();
      secondTransfer = createTransfer();
      thirdTransfer = createTransfer();

      graphqlClientStub.rawQuery.onFirstCall().resolves(
        generatePaginatedResponse({
          key: "transfers",
          items: [firstTransfer, secondTransfer],
          pageInfo: {
            hasNextPage: true,
            hasPreviousPage: false,
          },
        })
      );

      graphqlClientStub.rawQuery.onSecondCall().resolves(
        generatePaginatedResponse({
          key: "transfers",
          items: [thirdTransfer],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        })
      );
    });

    it("can fetch next page using the nextPage method", async () => {
      const firstPage = await transferInstance.fetch({
        first: 2,
        type: TransferType.SepaTransfer,
      });

      expect(typeof firstPage.nextPage).to.equal("function");
      expect(firstPage.items).to.deep.equal([firstTransfer, secondTransfer]);

      const secondPage = firstPage.nextPage && (await firstPage.nextPage());
      expect(secondPage?.items).to.deep.equal([thirdTransfer]);
    });

    it("can iterate on all user transfers using the fetchAll iterator", async () => {
      let transfers: Transfer[] = [];
      for await (const transfer of transferInstance.fetchAll({
        type: TransferType.SepaTransfer,
      })) {
        transfers = transfers.concat(transfer as Transfer);
      }

      expect(transfers).to.deep.equal([
        firstTransfer,
        secondTransfer,
        thirdTransfer,
      ]);
    });

    describe("when iterating backwards", () => {
      it("can fetch the previous page using the previousPage method", async () => {
        graphqlClientStub.rawQuery.onFirstCall().resolves(
          generatePaginatedResponse({
            key: "transfers",
            items: [secondTransfer, thirdTransfer],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true,
            },
          })
        );

        graphqlClientStub.rawQuery.onSecondCall().resolves(
          generatePaginatedResponse({
            key: "transfers",
            items: [firstTransfer],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
            },
          })
        );

        const firstPage = await transferInstance.fetch({
          last: 2,
          type: TransferType.SepaTransfer,
        });

        expect(typeof firstPage.previousPage).to.equal("function");
        expect(firstPage.items).to.deep.equal([secondTransfer, thirdTransfer]);

        const secondPage =
          firstPage.previousPage && (await firstPage.previousPage());
        expect(secondPage?.items).to.deep.equal([firstTransfer]);
      });
    });
  });

  describe("#suggestions", () => {
    const suggestions = [
      { iban: "DE12345", name: "First customer" },
      { iban: "DE54321", name: "Second customer" },
    ];

    describe("when user has an account", () => {
      before(async () => {
        graphqlClientStub.rawQuery.reset();
        graphqlClientStub.rawQuery.resolves({
          viewer: { mainAccount: { transferSuggestions: suggestions } },
        });
        result = await transferInstance.suggestions();
      });

      it("should send transferSuggestions query", () => {
        expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
        const [query] = graphqlClientStub.rawQuery.getCall(0).args;
        expect(query).to.include("transferSuggestions");
      });

      it("should return transferSuggestions result", () => {
        expect(result).to.eql(suggestions);
      });
    });

    describe("when user doesn't have an account", () => {
      before(async () => {
        graphqlClientStub.rawQuery.reset();
        graphqlClientStub.rawQuery.resolves({
          viewer: { mainAccount: null },
        });
        result = await transferInstance.suggestions();
      });

      it("should return an empty array", () => {
        expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
        expect(result).to.eql([]);
      });
    });

    describe("when there is no user", () => {
      before(async () => {
        graphqlClientStub.rawQuery.reset();
        graphqlClientStub.rawQuery.resolves({});
        result = await transferInstance.suggestions();
      });

      it("should return an empty array", () => {
        expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
        expect(result).to.eql([]);
      });
    });
  });

  describe("#fetch", () => {
    describe("when there is no result", () => {
      before(async () => {
        graphqlClientStub.rawQuery.reset();
        graphqlClientStub.rawQuery.resolves({});
        result = await transferInstance.fetch({
          type: TransferType.SepaTransfer,
        });
      });

      it("should return an empty result", () => {
        expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
        expect(result.items).to.eql([]);
        expect(result.pageInfo.hasNextPage).to.eql(false);
        expect(result.pageInfo.hasPreviousPage).to.eql(false);
      });
    });
  });

  describe("update - Standing Order", () => {
    const updatePayload = {
      id: "some-id",
      amount: 2345,
      purpose: "some money",
      e2eId: "some-e2e-id",
      reoccurrence: StandingOrderReoccurrenceType.Annually,
      lastExecutionDate: "2022-02-02",
      type: TransferType.StandingOrder,
    };
    const confirmationId = "standing-order:123456789";

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        updateTransfer: {
          confirmationId,
        },
      });
      result = await transferInstance.update({ transfer: updatePayload });
    });

    it("should send updateTransfer GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("updateTransfer");
      expect(variables).to.eql({
        transfer: updatePayload,
        deliveryMethod: undefined,
        deviceId: undefined,
      });
    });

    it("should return updateTransfer result", () => {
      expect(result).to.eql({ confirmationId });
    });
  });

  describe("update - SEPA Transfer", () => {
    const category = TransactionCategory.TaxPayment;
    const userSelectedBookingDate = new Date().toISOString();
    const personalNote = "business travel";
    const updatePayload = {
      id: "some-id",
      type: TransferType.SepaTransfer,
      category,
      userSelectedBookingDate,
      personalNote,
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        updateTransfer: {
          category,
          userSelectedBookingDate,
          personalNote,
        },
      });
      result = await transferInstance.update({ transfer: updatePayload });
    });

    it("should send updateTransfer GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("updateTransfer");
      expect(variables).to.eql({
        transfer: updatePayload,
        deliveryMethod: undefined,
        deviceId: undefined,
      });
    });

    it("should return updateTransfer result", () => {
      expect(result).to.eql({
        category,
        userSelectedBookingDate,
        personalNote,
      });
    });
  });

  describe("update - Timed Order", () => {
    const category = TransactionCategory.TaxPayment;
    const userSelectedBookingDate = new Date().toISOString();
    const personalNote = "best French restaurant in Berlin";
    const updatePayload = {
      id: "some-id",
      type: TransferType.TimedOrder,
      category,
      userSelectedBookingDate,
      personalNote,
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        updateTransfer: {
          category,
          userSelectedBookingDate,
          personalNote,
        },
      });
      result = await transferInstance.update({ transfer: updatePayload });
    });

    it("should send updateTransfer GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("updateTransfer");
      expect(variables).to.eql({
        transfer: updatePayload,
        deliveryMethod: undefined,
        deviceId: undefined,
      });
    });

    it("should return updateTransfer result", () => {
      expect(result).to.eql({
        category,
        userSelectedBookingDate,
        personalNote,
      });
    });
  });

  describe("#fetchUnfinished", () => {
    let result: UnfinishedTransfer[];

    const unfinishedTransfers = [
      {
        amount: 1234,
        recipient: "John Doe",
        iban: "DE32110101001000000029",
        purpose: "time is money",
      },
    ];

    describe("when there are unfinished transfers", () => {
      before(async () => {
        graphqlClientStub.rawQuery.reset();
        graphqlClientStub.rawQuery.resolves({
          viewer: {
            unfinishedTransfers,
          },
        });
        result = await transferInstance.fetchUnfinished();
      });

      it("should return list of unfinished transfers", () => {
        expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
        expect(result).to.eql(unfinishedTransfers);
      });
    });

    describe("when response does not contain unfinished transfers", () => {
      before(async () => {
        graphqlClientStub.rawQuery.reset();
        graphqlClientStub.rawQuery.resolves({});
        result = await transferInstance.fetchUnfinished();
      });

      it("should return empty list", () => {
        expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
        expect(result).to.eql([]);
      });
    });
  });
});
