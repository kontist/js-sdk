import { Account } from "./account";
import { Card } from "./card";
import { GraphQLClient } from "./client";
import { Subscription } from "./subscription";
import { Transaction } from "./transaction";
import { Transfer } from "./transfer";
import { User } from "./user";
import { ChangeRequest } from "./changeRequest";
import { Declaration } from "./declaration";
import { Document } from "./document";
import { TaxNumber } from "./taxNumber";
import { BusinessAddress } from "./businessAddress";

export const getModels = (graphQLClient: GraphQLClient) => ({
  account: new Account(graphQLClient),
  card: new Card(graphQLClient),
  subscription: new Subscription(graphQLClient),
  transaction: new Transaction(graphQLClient),
  transfer: new Transfer(graphQLClient),
  user: new User(graphQLClient),
  changeRequest: new ChangeRequest(graphQLClient),
  declaration: new Declaration(graphQLClient),
  document: new Document(graphQLClient),
  taxNumber: new TaxNumber(graphQLClient),
  businessAddress: new BusinessAddress(graphQLClient),
});
