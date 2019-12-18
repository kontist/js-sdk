import { User } from "./user";
import { Account } from "./account";
import { Transfer } from "./transfer";
import { Transaction } from "./transaction";
import { GraphQLClient } from "./client";
import { Card } from "./card";
export declare const getModels: (graphQLClient: GraphQLClient) => {
    transaction: Transaction;
    transfer: Transfer;
    account: Account;
    user: User;
    card: Card;
};
