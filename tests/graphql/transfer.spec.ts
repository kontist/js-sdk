import { expect } from "chai";
import * as sinon from "sinon";
import { Transfer as TransferClass } from "../../lib/graphql/transfer";
import {
  TransferType,
  Transfer,
  StandingOrderReoccurenceType,
  TransactionCategory
} from "../../lib/graphql/schema";
import { createTransfer, generatePaginatedResponse } from "../helpers";

describe("Transfer", () => {
  let graphqlClientStub: { rawQuery: sinon.SinonStub };
  let transferInstance: TransferClass;
  let result: any;

  before(() => {
    graphqlClientStub = {
      rawQuery: sinon.stub(),
    };
    transferInstance = new TransferClass(graphqlClientStub as any);
  });

  describe("cancelTransfer", () => {
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
      result = await transferInstance.cancelTransfer(type, id);
    });

    it("should send cancelTransfer GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("cancelTransfer");
      expect(variables).to.eql({ type, id });
    });

    it("should return cancelTransfer result", () => {
      expect(result).to.eql(cancelTransferResult);
    });
  });

  describe("confirmCancelTransfer", () => {
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
      result = await transferInstance.confirmCancelTransfer(
        type,
        confirmationId,
        authorizationToken,
      );
    });

    it("should send confirmCancelTransfer GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("confirmCancelTransfer");
      expect(variables).to.eql({ type, confirmationId, authorizationToken });
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
        }),
      );

      graphqlClientStub.rawQuery.onSecondCall().resolves(
        generatePaginatedResponse({
          key: "transfers",
          items: [thirdTransfer],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        }),
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
          }),
        );

        graphqlClientStub.rawQuery.onSecondCall().resolves(
          generatePaginatedResponse({
            key: "transfers",
            items: [firstTransfer],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
            },
          }),
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

  describe("suggestions", () => {
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
  });

  describe("update - Standing Order", () => {
    const updatePayload = {
      id: "some-id",
      amount: 2345,
      purpose: "some money",
      e2eId: "some-e2e-id",
      reoccurrence: StandingOrderReoccurenceType.Annually,
      lastExecutionDate: "2022-02-02",
      type: TransferType.StandingOrder
    };
    const confirmationId = "standing-order:123456789";

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        updateTransfer: {
          confirmationId
        }
      });
      result = await transferInstance.update(updatePayload);
    });

    it("should send updateTransfer GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("updateTransfer");
      expect(variables).to.eql({ transfer: updatePayload });
    });

    it("should return updateTransfer result", () => {
      expect(result).to.eql({ confirmationId });
    });
  });

  describe("update - SEPA Transfer", () => {
    const category = TransactionCategory.TaxPayment;
    const userSelectedBookingDate = new Date().toISOString();
    const updatePayload = {
      id: "some-id",
      type: TransferType.SepaTransfer,
      category,
      userSelectedBookingDate
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        updateTransfer: {
          category,
          userSelectedBookingDate
        }
      });
      result = await transferInstance.update(updatePayload);
    });

    it("should send updateTransfer GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("updateTransfer");
      expect(variables).to.eql({ transfer: updatePayload });
    });

    it("should return updateTransfer result", () => {
      expect(result).to.eql({
        category,
        userSelectedBookingDate
      });
    });
  });

  describe("update - Timed Order", () => {
    const category = TransactionCategory.TaxPayment;
    const userSelectedBookingDate = new Date().toISOString();
    const updatePayload = {
      id: "some-id",
      type: TransferType.TimedOrder,
      category,
      userSelectedBookingDate
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        updateTransfer: {
          category,
          userSelectedBookingDate
        }
      });
      result = await transferInstance.update(updatePayload);
    });

    it("should send updateTransfer GraphQL mutation", () => {
      expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
      const [query, variables] = graphqlClientStub.rawQuery.getCall(0).args;
      expect(query).to.include("updateTransfer");
      expect(variables).to.eql({ transfer: updatePayload });
    });

    it("should return updateTransfer result", () => {
      expect(result).to.eql({
        category,
        userSelectedBookingDate
      });
    });
  });
});
