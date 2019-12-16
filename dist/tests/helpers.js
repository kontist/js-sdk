"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var schema_1 = require("../lib/graphql/schema");
var lib_1 = require("../lib");
exports.clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
exports.redirectUri = "https://localhost:3000/auth/callback";
exports.scopes = ["transactions"];
exports.state = "25843739712322056";
exports.createClient = function (opts) {
    if (opts === void 0) { opts = {}; }
    return new lib_1.Client(__assign({ clientId: exports.clientId,
        redirectUri: exports.redirectUri,
        scopes: exports.scopes,
        state: exports.state }, opts));
};
exports.createTransaction = function () {
    return {
        id: Math.random.toString(),
        amount: parseInt((Math.random() * 100).toString()),
        directDebitFees: [],
        type: schema_1.TransactionProjectionType.Atm,
        fees: [],
        bookingDate: new Date(),
        paymentMethod: "card"
    };
};
exports.createTransfer = function (override) {
    if (override === void 0) { override = {}; }
    return __assign({ id: Math.random.toString(), recipient: "John Doe", iban: "DE32110101001000000029", amount: parseInt((Math.random() * 100).toString()), status: schema_1.TransferStatus.Confirmed, executeAt: null, lastExecutionDate: null, purpose: "some transfer purpose", e2eId: "some-e2e-id", reoccurrence: null, nextOccurrence: null }, override);
};
exports.generatePaginatedResponse = function (_a) {
    var _b;
    var key = _a.key, items = _a.items, pageInfo = _a.pageInfo;
    return ({
        viewer: {
            mainAccount: (_b = {},
                _b[key] = {
                    edges: items.map(function (item) { return ({
                        node: item,
                        cursor: "1234"
                    }); }),
                    pageInfo: __assign({ startCursor: "111111", endCursor: "22222" }, pageInfo)
                },
                _b)
        }
    });
};
//# sourceMappingURL=helpers.js.map