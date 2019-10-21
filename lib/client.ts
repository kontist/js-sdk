import { Auth } from "./auth";
import { GraphQLClient } from "./graphql/client";
import { ClientOpts } from "./types";
import { KONTIST_API_BASE_URL } from "./constants";
import { Transaction } from "./graphql/transaction";
import { Model } from "./graphql/model";

export class Client {
  public auth: Auth;
  public graphQL: GraphQLClient;
  public models: {
    transaction: Transaction;
  };

  constructor(opts: ClientOpts) {
    const baseUrl = opts.baseUrl || KONTIST_API_BASE_URL;
    this.auth = new Auth(baseUrl, opts);
    this.graphQL = new GraphQLClient(`${baseUrl}/api/graphql`, this.auth);
    this.models = {
      transaction: new Transaction(this.graphQL)
    };
  }
}
