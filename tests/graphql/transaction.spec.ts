import { expect } from "chai";
import * as sinon from "sinon";
import { RawQueryResponse, SubscriptionType } from "../../lib/graphql/types";
import { Transaction } from "../../lib/graphql/schema";
import { Client } from "../../lib";
import { createClient, createTransaction } from "../helpers";
import { NEW_TRANSACTION_SUBSCRIPTION } from "../../lib/graphql/transaction";

describe("Transaction", () => {
  describe("iterator", () => {
    let client: Client;
    let firstTransaction: any;
    let secondTransaction: any;
    let firstResponse: any;
    let secondResponse: any;
    let stub: any;

    beforeEach(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");

      firstTransaction = createTransaction();
      secondTransaction = createTransaction();

      firstResponse = {
        viewer: {
          mainAccount: {
            transactions: {
              edges: [
                {
                  node: firstTransaction,
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

      stub.onFirstCall().resolves(firstResponse);

      secondResponse = {
        viewer: {
          mainAccount: {
            transactions: {
              edges: [
                {
                  node: secondTransaction,
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

      stub.onSecondCall().resolves(secondResponse as RawQueryResponse);
    });

    afterEach(() => {
      stub.restore();
    });

    it("can fetch next page using the nextPage method", async () => {
      const firstPage = await client.models.transaction.fetch({
        first: 1
      });

      expect(typeof firstPage.nextPage).to.equal("function");
      expect(firstPage.items).to.deep.equal([firstTransaction]);

      const secondPage = firstPage.nextPage && (await firstPage.nextPage());
      expect(secondPage?.items).to.deep.equal([secondTransaction]);
    });

    it("can iterate on all user transactions using the fetchAll iterator", async () => {
      let transactions: Array<Transaction> = [];
      for await (const transaction of client.models.transaction.fetchAll()) {
        transactions = transactions.concat(transaction as Transaction);
      }

      expect(transactions).to.deep.equal([firstTransaction, secondTransaction]);
    });

    describe("when iterating backwards", () => {
      it("can fetch the previous page using the previousPage method", async () => {
        firstResponse.viewer.mainAccount.transactions.pageInfo.hasNextPage = false;
        secondResponse.viewer.mainAccount.transactions.pageInfo.hasPreviousPage = true;

        stub.onFirstCall().resolves(secondResponse);
        stub.onSecondCall().resolves(firstResponse);

        const firstPage = await client.models.transaction.fetch({
          last: 1
        });

        expect(typeof firstPage.previousPage).to.equal("function");
        expect(firstPage.items).to.deep.equal([secondTransaction]);

        const secondPage =
          firstPage.previousPage && (await firstPage.previousPage());
        expect(secondPage?.items).to.deep.equal([firstTransaction]);
      });
    });
  });

  describe("subscribe", () => {
    it("should call the corresponding graphQL client method to subscribe", () => {
      const client = createClient();
      const unsubscribe = () => {};
      const callback = () => {};
      const subscribeStub = sinon
        .stub(client.graphQL, "subscribe")
        .returns({ unsubscribe });

      const result = client.models.transaction.subscribe(callback);

      expect(subscribeStub.callCount).to.equal(1);
      const { query, type, onNext } = subscribeStub.getCall(0).args[0];
      expect(query).to.equal(NEW_TRANSACTION_SUBSCRIPTION);
      expect(type).to.equal(SubscriptionType.newTransaction);
      expect(onNext).to.equal(callback);
      expect(result).to.deep.equal({ unsubscribe });
    });
  });
});
