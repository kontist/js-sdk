import * as sinon from "sinon";
import { expect } from "chai";
import { Transfer as TransferClass } from "../../lib/graphql/transfer";
import { TransferType, Transfer } from "../../lib/graphql/schema";
import { createTransfer } from "../helpers";

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
    let firstTransfer: any;
    let secondTransfer: any;

    beforeEach(() => {
      graphqlClientStub.rawQuery.reset();

      firstTransfer = createTransfer();
      secondTransfer = createTransfer();

      const firstResponse: any = {
        viewer: {
          mainAccount: {
            transfers: {
              edges: [
                {
                  node: firstTransfer,
                  cursor: "1234"
                }
              ],
              pageInfo: {
                startCursor: "111111",
                endCursor: "22222",
                hasNextPage: true,
                hasPreviousPage: false
              }
            }
          }
        }
      };

      graphqlClientStub.rawQuery.onFirstCall().resolves(firstResponse);

      const secondResponse: any = {
        viewer: {
          mainAccount: {
            transfers: {
              edges: [
                {
                  node: secondTransfer,
                  cursor: "1234"
                }
              ],
              pageInfo: {
                startCursor: "111111",
                endCursor: "22222",
                hasNextPage: false,
                hasPreviousPage: false
              }
            }
          }
        }
      };

      graphqlClientStub.rawQuery.onSecondCall().resolves(secondResponse);
    });

    it("can fetch next page using the nextPage method", async () => {
      const firstPage = await transferInstance.fetch({
        first: 1,
        type: TransferType.SepaTransfer
      });

      expect(typeof firstPage.nextPage).to.equal("function");
      expect(firstPage.items).to.deep.equal([firstTransfer]);

      const secondPage = firstPage.nextPage && (await firstPage.nextPage());
      expect(secondPage?.items).to.deep.equal([secondTransfer]);
    });

    it("can iterate on all user transfers using the fetchAll iterator", async () => {
      let transfers: Array<Transfer> = [];
      for await (const transfer of transferInstance.fetchAll({
        type: TransferType.SepaTransfer
      })) {
        transfers = transfers.concat(transfer as Transfer);
      }

      expect(transfers).to.deep.equal([firstTransfer, secondTransfer]);
    });
  });
});
