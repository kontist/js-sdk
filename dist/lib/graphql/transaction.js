"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var iterableModel_1 = require("./iterableModel");
var types_1 = require("./types");
var resultPage_1 = require("./resultPage");
var TRANSACTION_FIELDS = "\n  id\n  amount\n  name\n  iban\n  type\n  bookingDate\n  valutaDate\n  originalAmount\n  foreignCurrency\n  e2eId\n  mandateNumber\n  paymentMethod\n  category\n  userSelectedBookingDate\n  purpose\n  documentNumber\n  documentPreviewUrl\n  documentDownloadUrl\n  documentType\n";
var FETCH_TRANSACTIONS = "query fetchTransactions ($first: Int, $last: Int, $after: String, $before: String) {\n  viewer {\n    mainAccount {\n      transactions(first: $first, last: $last, after: $after, before: $before) {\n        edges {\n          node {\n            " + TRANSACTION_FIELDS + "\n          }\n        }\n        pageInfo {\n          hasNextPage\n          hasPreviousPage\n          startCursor\n          endCursor\n        }\n      }\n    }\n  }\n}";
exports.NEW_TRANSACTION_SUBSCRIPTION = "subscription {\n  newTransaction {\n    " + TRANSACTION_FIELDS + "\n  }\n}";
var Transaction = /** @class */ (function (_super) {
    __extends(Transaction, _super);
    function Transaction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Fetches first 50 transactions which match the query
     *
     * @param args  query parameters
     * @returns     result page
     */
    Transaction.prototype.fetch = function (args) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function () {
            var result, transactions, pageInfo;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(FETCH_TRANSACTIONS, args)];
                    case 1:
                        result = _l.sent();
                        transactions = (_e = (_d = (_c = (_b = (_a = result) === null || _a === void 0 ? void 0 : _a.viewer) === null || _b === void 0 ? void 0 : _b.mainAccount) === null || _c === void 0 ? void 0 : _c.transactions) === null || _d === void 0 ? void 0 : _d.edges, (_e !== null && _e !== void 0 ? _e : [])).map(function (edge) { return edge.node; });
                        pageInfo = (_k = (_j = (_h = (_g = (_f = result) === null || _f === void 0 ? void 0 : _f.viewer) === null || _g === void 0 ? void 0 : _g.mainAccount) === null || _h === void 0 ? void 0 : _h.transactions) === null || _j === void 0 ? void 0 : _j.pageInfo, (_k !== null && _k !== void 0 ? _k : {
                            hasNextPage: false,
                            hasPreviousPage: false
                        }));
                        return [2 /*return*/, new resultPage_1.ResultPage(this, transactions, pageInfo, args)];
                }
            });
        });
    };
    /**
     * @inheritdoc
     */
    Transaction.prototype.fetchAll = function (args) {
        return _super.prototype.fetchAll.call(this, (args !== null && args !== void 0 ? args : {}));
    };
    Transaction.prototype.subscribe = function (onNext, onError) {
        return this.client.subscribe({
            query: exports.NEW_TRANSACTION_SUBSCRIPTION,
            type: types_1.SubscriptionType.newTransaction,
            onNext: onNext,
            onError: onError
        });
    };
    return Transaction;
}(iterableModel_1.IterableModel));
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map