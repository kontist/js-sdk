import { Auth } from "./auth";
import { GraphQLClient } from "./graphql/client";
import { ClientOpts } from "./types";
import { KONTIST_API_BASE_URL } from "./constants";
import { getModels, Models } from "./graphql";

export class Client {
  public auth: Auth;
  public graphQL: GraphQLClient;
  public models: Models;

  constructor(opts: ClientOpts) {
    const baseUrl = opts.baseUrl || KONTIST_API_BASE_URL;
    this.auth = new Auth(baseUrl, opts);
    this.graphQL = new GraphQLClient(`${baseUrl}/api/graphql`, this.auth);
    this.models = getModels(this.graphQL);
  }
}
