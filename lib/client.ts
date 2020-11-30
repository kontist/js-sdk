import { Auth } from "./auth";
import { KONTIST_API_BASE_URL, KONTIST_SUBSCRIPTION_API_BASE_URL } from "./constants";
import { getModels } from "./graphql";
import { GraphQLClient } from "./graphql/client";
import { ClientOpts } from "./types";

export class Client<T extends Partial<ClientOpts> = ClientOpts> {
  constructor(
    opts: T,
    baseUrl = opts.baseUrl || KONTIST_API_BASE_URL,
    baseSubscriptionUrl = opts.baseSubscriptionUrl || KONTIST_SUBSCRIPTION_API_BASE_URL,
    public auth: T extends { clientId?: string | undefined } ? Auth : undefined = opts.clientId ? new Auth(baseUrl, opts as ClientOpts) : undefined as any,
    public graphQL = new GraphQLClient({
      auth,
      endpoint: `${baseUrl}/api/graphql`,
      subscriptionEndpoint: `${baseSubscriptionUrl}/api/graphql`,
    }),
    public models = getModels(graphQL),
  ) { }
}
