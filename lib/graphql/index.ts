import { Account } from "./account";
import { Card } from "./card";
import { GraphQLClient } from "./client";
import { Transaction } from "./transaction";
import { Transfer } from "./transfer";
import { User } from "./user";

export const getModels = (graphQLClient: GraphQLClient) => ({
  account: new Account(graphQLClient),
  card: new Card(graphQLClient),
  transaction: new Transaction(graphQLClient),
  transfer: new Transfer(graphQLClient),
  user: new User(graphQLClient),
});
