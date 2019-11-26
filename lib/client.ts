import { Auth } from "./auth";
import { GraphQLClient } from "./graphql/client";
import { ClientOpts } from "./types";
import { KONTIST_API_BASE_URL, KONTIST_SUBSCRIPTION_API_BASE_URL } from "./constants";
import { getModels } from "./graphql";

export class Client {
  constructor(
    opts: ClientOpts,
    baseUrl = opts.baseUrl || KONTIST_API_BASE_URL,
    baseSubscriptionUrl = opts.baseSubscriptionUrl || KONTIST_SUBSCRIPTION_API_BASE_URL,
    public auth = new Auth(baseUrl, opts),
    public graphQL = new GraphQLClient({
      auth,
      endpoint: `${baseUrl}/api/graphql`,
      subscriptionEndpoint: `${baseSubscriptionUrl}/api/graphql`
    }),
    public models = getModels(graphQL)
  ) {}
}
