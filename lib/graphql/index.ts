import { User } from "./user";
import { Account } from "./account";
import { Transfer } from "./transfer";
import { Transaction } from "./transaction";
import { GraphQLClient } from "./client";

export type Models = {
  transaction: Transaction;
  transfer: Transfer;
  account: Account;
  user: User;
};

export const getModels = (graphQLClient: GraphQLClient): Models => ({
  transaction: new Transaction(graphQLClient),
  transfer: new Transfer(graphQLClient),
  account: new Account(graphQLClient),
  user: new User(graphQLClient)
});
