"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = require("./user");
var account_1 = require("./account");
var transfer_1 = require("./transfer");
var transaction_1 = require("./transaction");
exports.getModels = function (graphQLClient) { return ({
    transaction: new transaction_1.Transaction(graphQLClient),
    transfer: new transfer_1.Transfer(graphQLClient),
    account: new account_1.Account(graphQLClient),
    user: new user_1.User(graphQLClient)
}); };
//# sourceMappingURL=index.js.map