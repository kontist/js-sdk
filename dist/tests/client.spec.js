"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var lib_1 = require("../lib");
describe("Client", function () {
    describe("#constructor", function () {
        it("should be able to create a client with minimal parameters", function () {
            var clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
            var redirectUri = "https://localhost:3000/auth/callback";
            var scopes = ["transactions"];
            var state = "25843739712322056";
            var client = new lib_1.Client({
                clientId: clientId,
                redirectUri: redirectUri,
                scopes: scopes,
                state: state
            });
            chai_1.expect(client).to.exist;
        });
        it("should be able to create a client with all parameters", function () {
            // arrange
            var clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
            var redirectUri = "https://localhost:3000/auth/callback";
            var scopes = ["transactions"];
            var state = "25843739712322056";
            var opts = {
                clientId: clientId,
                redirectUri: redirectUri,
                scopes: scopes,
                state: state
            };
            var auth = {};
            var graphQL = {};
            var models = {
                transaction: {},
                transfer: {},
                account: {},
                user: {},
                card: {}
            };
            // act
            var client = new lib_1.Client(opts, "http://localhost:3000/api/graphql", "ws://localhost:3000/api/graphql", auth, graphQL, models);
            // assert
            chai_1.expect(client).to.exist;
        });
    });
});
//# sourceMappingURL=client.spec.js.map