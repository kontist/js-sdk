import { expect } from "chai";
import * as sinon from "sinon";
import { RawQueryResponse } from "../lib/graphql/types";
import { Transaction } from "../lib/graphql/schema";
import { createClient, createTransaction } from "./helpers";

describe("Transaction", () => {
  describe("iterator", () => {
    it("can iterate on all user transactions", async () => {
      const client = createClient();
      const stub = sinon.stub(client.graphQL, "rawQuery");

      const firstTransaction = createTransaction();
      const secondTransaction = createTransaction();

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

      let transactions: Array<Transaction> = [];
      for await (const transaction of client.models.transaction) {
        transactions = transactions.concat(transaction as Transaction);
      }

      expect(transactions).to.deep.equal([firstTransaction, secondTransaction]);
    });
  });
});