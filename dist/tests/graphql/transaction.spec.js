"use strict";
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var types_1 = require("../../lib/graphql/types");
var helpers_1 = require("../helpers");
var transaction_1 = require("../../lib/graphql/transaction");
describe("Transaction", function () {
    describe("iterator", function () {
        var client;
        var firstTransaction;
        var secondTransaction;
        var thirdTransaction;
        var stub;
        beforeEach(function () {
            client = helpers_1.createClient();
            stub = sinon.stub(client.graphQL, "rawQuery");
            firstTransaction = helpers_1.createTransaction();
            secondTransaction = helpers_1.createTransaction();
            thirdTransaction = helpers_1.createTransaction();
            stub.onFirstCall().resolves(helpers_1.generatePaginatedResponse({
                key: "transactions",
                items: [firstTransaction, secondTransaction],
                pageInfo: { hasNextPage: true, hasPreviousPage: false }
            }));
            stub.onSecondCall().resolves(helpers_1.generatePaginatedResponse({
                key: "transactions",
                items: [thirdTransaction],
                pageInfo: { hasNextPage: false, hasPreviousPage: false }
            }));
        });
        afterEach(function () {
            stub.restore();
        });
        it("can fetch next page using the nextPage method", function () { return __awaiter(void 0, void 0, void 0, function () {
            var firstPage, secondPage, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, client.models.transaction.fetch({
                            first: 2
                        })];
                    case 1:
                        firstPage = _c.sent();
                        chai_1.expect(typeof firstPage.nextPage).to.equal("function");
                        chai_1.expect(firstPage.items).to.deep.equal([
                            firstTransaction,
                            secondTransaction
                        ]);
                        _a = firstPage.nextPage;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, firstPage.nextPage()];
                    case 2:
                        _a = (_c.sent());
                        _c.label = 3;
                    case 3:
                        secondPage = _a;
                        chai_1.expect((_b = secondPage) === null || _b === void 0 ? void 0 : _b.items).to.deep.equal([thirdTransaction]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("can iterate on all user transactions using the fetchAll iterator", function () { return __awaiter(void 0, void 0, void 0, function () {
            var transactions, _a, _b, transaction, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        transactions = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 12]);
                        _a = __asyncValues(client.models.transaction.fetchAll());
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _a.next()];
                    case 3:
                        if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 5];
                        transaction = _b.value;
                        transactions = transactions.concat(transaction);
                        _d.label = 4;
                    case 4: return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _d.trys.push([7, , 10, 11]);
                        if (!(_b && !_b.done && (_c = _a.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _c.call(_a)];
                    case 8:
                        _d.sent();
                        _d.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12:
                        chai_1.expect(transactions).to.deep.equal([
                            firstTransaction,
                            secondTransaction,
                            thirdTransaction
                        ]);
                        return [2 /*return*/];
                }
            });
        }); });
        describe("when iterating backwards", function () {
            it("can fetch the previous page using the previousPage method", function () { return __awaiter(void 0, void 0, void 0, function () {
                var firstPage, secondPage, _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            stub.onFirstCall().resolves(helpers_1.generatePaginatedResponse({
                                key: "transactions",
                                items: [secondTransaction, thirdTransaction],
                                pageInfo: { hasPreviousPage: true, hasNextPage: false }
                            }));
                            stub.onSecondCall().resolves(helpers_1.generatePaginatedResponse({
                                key: "transactions",
                                items: [firstTransaction],
                                pageInfo: { hasPreviousPage: false, hasNextPage: false }
                            }));
                            return [4 /*yield*/, client.models.transaction.fetch({
                                    last: 2
                                })];
                        case 1:
                            firstPage = _c.sent();
                            chai_1.expect(typeof firstPage.previousPage).to.equal("function");
                            chai_1.expect(firstPage.items).to.deep.equal([
                                secondTransaction,
                                thirdTransaction
                            ]);
                            _a = firstPage.previousPage;
                            if (!_a) return [3 /*break*/, 3];
                            return [4 /*yield*/, firstPage.previousPage()];
                        case 2:
                            _a = (_c.sent());
                            _c.label = 3;
                        case 3:
                            secondPage = _a;
                            chai_1.expect((_b = secondPage) === null || _b === void 0 ? void 0 : _b.items).to.deep.equal([firstTransaction]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe("subscribe", function () {
        it("should call the corresponding graphQL client method to subscribe", function () {
            var client = helpers_1.createClient();
            var unsubscribe = function () { };
            var callback = function () { };
            var subscribeStub = sinon
                .stub(client.graphQL, "subscribe")
                .returns({ unsubscribe: unsubscribe });
            var result = client.models.transaction.subscribe(callback);
            chai_1.expect(subscribeStub.callCount).to.equal(1);
            var _a = subscribeStub.getCall(0).args[0], query = _a.query, type = _a.type, onNext = _a.onNext;
            chai_1.expect(query).to.equal(transaction_1.NEW_TRANSACTION_SUBSCRIPTION);
            chai_1.expect(type).to.equal(types_1.SubscriptionType.newTransaction);
            chai_1.expect(onNext).to.equal(callback);
            chai_1.expect(result).to.deep.equal({ unsubscribe: unsubscribe });
        });
    });
});
//# sourceMappingURL=transaction.spec.js.map