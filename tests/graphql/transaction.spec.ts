import { expect } from "chai";
import * as sinon from "sinon";
import { RawQueryResponse } from "../../lib/graphql/types";
import { Transaction } from "../../lib/graphql/schema";
import { Client } from "../../lib";
import { createClient, createTransaction } from "../helpers";

describe("Transaction", () => {
  describe("iterator", () => {
    let client: Client;
    let firstTransaction: any;
    let secondTransaction: any;
    let stub: any;

    beforeEach(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");

      firstTransaction = createTransaction();
      secondTransaction = createTransaction();

      const firstResponse: any = {
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

      const secondResponse: any = {
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

    it("can iterate on all user transactions using the root iterator", async () => {
      let transactions: Array<Transaction> = [];
      for await (const transaction of client.models.transaction) {
        transactions = transactions.concat(transaction as Transaction);
      }

      expect(transactions).to.deep.equal([firstTransaction, secondTransaction]);
    });

    it("can iterate on all user transactions using the fetchAll iterator", async () => {
      let transactions: Array<Transaction> = [];
      for await (const transaction of client.models.transaction.fetchAll()) {
        transactions = transactions.concat(transaction as Transaction);
      }

      expect(transactions).to.deep.equal([firstTransaction, secondTransaction]);
    });
  });
});
