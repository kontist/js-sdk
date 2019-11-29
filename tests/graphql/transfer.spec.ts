import * as sinon from "sinon";
import { expect } from "chai";
import { Transfer as TransferClass } from "../../lib/graphql/transfer";
import { TransferType, Transfer } from "../../lib/graphql/schema";
import { createTransfer, generatePaginatedResponse } from "../helpers";

describe("Transfer", () => {
  let graphqlClientStub: { rawQuery: sinon.SinonStub };
  let transferInstance: TransferClass;
  let result: any;

  before(() => {
    graphqlClientStub = {
      rawQuery: sinon.stub()
    };
    transferInstance = new TransferClass(<any>graphqlClientStub);
  });

  describe("cancelTransfer", () => {
    const id = "id-stub";
    const type = TransferType.StandingOrder;
    const cancelTransferResult = {
      __stub__: "cancelTransferResult"
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        cancelTransfer: cancelTransferResult
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
      __stub__: "confirmCancelTransferResult"
    };

    before(async () => {
      graphqlClientStub.rawQuery.reset();
      graphqlClientStub.rawQuery.resolves({
        confirmCancelTransfer: confirmCancelTransferResult
      });
      result = await transferInstance.confirmCancelTransfer(
        type,
        confirmationId,
        authorizationToken
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
            hasPreviousPage: false
          }
        })
      );

      graphqlClientStub.rawQuery.onSecondCall().resolves(
        generatePaginatedResponse({
          key: "transfers",
          items: [thirdTransfer],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false
          }
        })
      );
    });

    it("can fetch next page using the nextPage method", async () => {
      const firstPage = await transferInstance.fetch({
        first: 2,
        type: TransferType.SepaTransfer
      });

      expect(typeof firstPage.nextPage).to.equal("function");
      expect(firstPage.items).to.deep.equal([firstTransfer, secondTransfer]);

      const secondPage = firstPage.nextPage && (await firstPage.nextPage());
      expect(secondPage?.items).to.deep.equal([thirdTransfer]);
    });

    it("can iterate on all user transfers using the fetchAll iterator", async () => {
      let transfers: Array<Transfer> = [];
      for await (const transfer of transferInstance.fetchAll({
        type: TransferType.SepaTransfer
      })) {
        transfers = transfers.concat(transfer as Transfer);
      }

      expect(transfers).to.deep.equal([firstTransfer, secondTransfer, thirdTransfer]);
    });

    describe("when iterating backwards", () => {
      it("can fetch the previous page using the previousPage method", async () => {
        graphqlClientStub.rawQuery.onFirstCall().resolves(
          generatePaginatedResponse({
            key: "transfers",
            items: [secondTransfer, thirdTransfer],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: true
            }
          })
        );

        graphqlClientStub.rawQuery.onSecondCall().resolves(
          generatePaginatedResponse({
            key: "transfers",
            items: [firstTransfer],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false
            }
          })
        );

        const firstPage = await transferInstance.fetch({
          last: 2,
          type: TransferType.SepaTransfer
        });

        expect(typeof firstPage.previousPage).to.equal("function");
        expect(firstPage.items).to.deep.equal([secondTransfer, thirdTransfer]);

        const secondPage =
          firstPage.previousPage && (await firstPage.previousPage());
        expect(secondPage?.items).to.deep.equal([firstTransfer]);
      });
    });
  });
});
