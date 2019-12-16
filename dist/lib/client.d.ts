import { Auth } from "./auth";
import { GraphQLClient } from "./graphql/client";
import { ClientOpts } from "./types";
export declare class Client {
    auth: Auth;
    graphQL: GraphQLClient;
    models: {
        transaction: import("./graphql/transaction").Transaction;
        transfer: import("./graphql/transfer").Transfer;
        account: import("./graphql/account").Account;
        user: import("./graphql/user").User;
    };
    constructor(opts: ClientOpts, baseUrl?: string, baseSubscriptionUrl?: string, auth?: Auth, graphQL?: GraphQLClient, models?: {
        transaction: import("./graphql/transaction").Transaction;
        transfer: import("./graphql/transfer").Transfer;
        account: import("./graphql/account").Account;
        user: import("./graphql/user").User;
    });
}
