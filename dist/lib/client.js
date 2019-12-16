"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = require("./auth");
var client_1 = require("./graphql/client");
var constants_1 = require("./constants");
var graphql_1 = require("./graphql");
var Client = /** @class */ (function () {
    function Client(opts, baseUrl, baseSubscriptionUrl, auth, graphQL, models) {
        if (baseUrl === void 0) { baseUrl = opts.baseUrl || constants_1.KONTIST_API_BASE_URL; }
        if (baseSubscriptionUrl === void 0) { baseSubscriptionUrl = opts.baseSubscriptionUrl || constants_1.KONTIST_SUBSCRIPTION_API_BASE_URL; }
        if (auth === void 0) { auth = new auth_1.Auth(baseUrl, opts); }
        if (graphQL === void 0) { graphQL = new client_1.GraphQLClient({
            auth: auth,
            endpoint: baseUrl + "/api/graphql",
            subscriptionEndpoint: baseSubscriptionUrl + "/api/graphql"
        }); }
        if (models === void 0) { models = graphql_1.getModels(graphQL); }
        this.auth = auth;
        this.graphQL = graphQL;
        this.models = models;
    }
    return Client;
}());
exports.Client = Client;
//# sourceMappingURL=client.js.map