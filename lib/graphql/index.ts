import { User } from "./user";
import { Account } from "./account";
import { Transfer } from "./transfer";
import { Transaction } from "./transaction";
import { GraphQLClient } from "./client";

export const getModels = (graphQLClient: GraphQLClient) => ({
  transaction: new Transaction(graphQLClient),
  transfer: new Transfer(graphQLClient),
  account: new Account(graphQLClient),
  user: new User(graphQLClient)
});