import { Transfer } from "./transfer";
import { Transaction } from "./transaction";
import { GraphQLClient } from "./client";

export type Models = {
  transaction: Transaction;
  transfer: Transfer;
};

export const getModels = (graphQLClient: GraphQLClient): Models => ({
  transaction: new Transaction(graphQLClient),
  transfer: new Transfer(graphQLClient)
});
