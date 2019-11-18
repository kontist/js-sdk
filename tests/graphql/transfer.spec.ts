import * as sinon from "sinon";
import { expect } from "chai";
import { Transfer } from "../../lib/graphql/transfer";
import { TransferType } from "../../lib/graphql/schema";

describe("Transfer", () => {
  let graphqlClientStub: { rawQuery: sinon.SinonStub };
  let transfer: Transfer;
  let result: any;

  before(() => {
    graphqlClientStub = {
      rawQuery: sinon.stub()
    };
    transfer = new Transfer(<any>graphqlClientStub);
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
      result = await transfer.cancelTransfer(type, id);
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
      result = await transfer.confirmCancelTransfer(type, confirmationId, authorizationToken);
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
});
