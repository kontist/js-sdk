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
var sinon = require("sinon");
var chai_1 = require("chai");
var transfer_1 = require("../../lib/graphql/transfer");
var schema_1 = require("../../lib/graphql/schema");
var helpers_1 = require("../helpers");
describe("Transfer", function () {
    var graphqlClientStub;
    var transferInstance;
    var result;
    before(function () {
        graphqlClientStub = {
            rawQuery: sinon.stub()
        };
        transferInstance = new transfer_1.Transfer(graphqlClientStub);
    });
    describe("cancelTransfer", function () {
        var id = "id-stub";
        var type = schema_1.TransferType.StandingOrder;
        var cancelTransferResult = {
            __stub__: "cancelTransferResult"
        };
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        graphqlClientStub.rawQuery.reset();
                        graphqlClientStub.rawQuery.resolves({
                            cancelTransfer: cancelTransferResult
                        });
                        return [4 /*yield*/, transferInstance.cancelTransfer(type, id)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should send cancelTransfer GraphQL mutation", function () {
            chai_1.expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
            var _a = graphqlClientStub.rawQuery.getCall(0).args, query = _a[0], variables = _a[1];
            chai_1.expect(query).to.include("cancelTransfer");
            chai_1.expect(variables).to.eql({ type: type, id: id });
        });
        it("should return cancelTransfer result", function () {
            chai_1.expect(result).to.eql(cancelTransferResult);
        });
    });
    describe("confirmCancelTransfer", function () {
        var type = schema_1.TransferType.StandingOrder;
        var confirmationId = "confirmation-id-stub";
        var authorizationToken = "authorization-token-stub";
        var confirmCancelTransferResult = {
            __stub__: "confirmCancelTransferResult"
        };
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        graphqlClientStub.rawQuery.reset();
                        graphqlClientStub.rawQuery.resolves({
                            confirmCancelTransfer: confirmCancelTransferResult
                        });
                        return [4 /*yield*/, transferInstance.confirmCancelTransfer(type, confirmationId, authorizationToken)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should send confirmCancelTransfer GraphQL mutation", function () {
            chai_1.expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
            var _a = graphqlClientStub.rawQuery.getCall(0).args, query = _a[0], variables = _a[1];
            chai_1.expect(query).to.include("confirmCancelTransfer");
            chai_1.expect(variables).to.eql({ type: type, confirmationId: confirmationId, authorizationToken: authorizationToken });
        });
        it("should return confirmCancelTransfer result", function () {
            chai_1.expect(result).to.eql(confirmCancelTransferResult);
        });
    });
    describe("iterator", function () {
        var firstTransfer;
        var secondTransfer;
        var thirdTransfer;
        beforeEach(function () {
            graphqlClientStub.rawQuery.reset();
            firstTransfer = helpers_1.createTransfer();
            secondTransfer = helpers_1.createTransfer();
            thirdTransfer = helpers_1.createTransfer();
            graphqlClientStub.rawQuery.onFirstCall().resolves(helpers_1.generatePaginatedResponse({
                key: "transfers",
                items: [firstTransfer, secondTransfer],
                pageInfo: {
                    hasNextPage: true,
                    hasPreviousPage: false
                }
            }));
            graphqlClientStub.rawQuery.onSecondCall().resolves(helpers_1.generatePaginatedResponse({
                key: "transfers",
                items: [thirdTransfer],
                pageInfo: {
                    hasNextPage: false,
                    hasPreviousPage: false
                }
            }));
        });
        it("can fetch next page using the nextPage method", function () { return __awaiter(void 0, void 0, void 0, function () {
            var firstPage, secondPage, _a;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, transferInstance.fetch({
                            first: 2,
                            type: schema_1.TransferType.SepaTransfer
                        })];
                    case 1:
                        firstPage = _c.sent();
                        chai_1.expect(typeof firstPage.nextPage).to.equal("function");
                        chai_1.expect(firstPage.items).to.deep.equal([firstTransfer, secondTransfer]);
                        _a = firstPage.nextPage;
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, firstPage.nextPage()];
                    case 2:
                        _a = (_c.sent());
                        _c.label = 3;
                    case 3:
                        secondPage = _a;
                        chai_1.expect((_b = secondPage) === null || _b === void 0 ? void 0 : _b.items).to.deep.equal([thirdTransfer]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("can iterate on all user transfers using the fetchAll iterator", function () { return __awaiter(void 0, void 0, void 0, function () {
            var transfers, _a, _b, transfer, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        transfers = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 12]);
                        _a = __asyncValues(transferInstance.fetchAll({
                            type: schema_1.TransferType.SepaTransfer
                        }));
                        _d.label = 2;
                    case 2: return [4 /*yield*/, _a.next()];
                    case 3:
                        if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 5];
                        transfer = _b.value;
                        transfers = transfers.concat(transfer);
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
                        chai_1.expect(transfers).to.deep.equal([firstTransfer, secondTransfer, thirdTransfer]);
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
                            graphqlClientStub.rawQuery.onFirstCall().resolves(helpers_1.generatePaginatedResponse({
                                key: "transfers",
                                items: [secondTransfer, thirdTransfer],
                                pageInfo: {
                                    hasNextPage: false,
                                    hasPreviousPage: true
                                }
                            }));
                            graphqlClientStub.rawQuery.onSecondCall().resolves(helpers_1.generatePaginatedResponse({
                                key: "transfers",
                                items: [firstTransfer],
                                pageInfo: {
                                    hasNextPage: false,
                                    hasPreviousPage: false
                                }
                            }));
                            return [4 /*yield*/, transferInstance.fetch({
                                    last: 2,
                                    type: schema_1.TransferType.SepaTransfer
                                })];
                        case 1:
                            firstPage = _c.sent();
                            chai_1.expect(typeof firstPage.previousPage).to.equal("function");
                            chai_1.expect(firstPage.items).to.deep.equal([secondTransfer, thirdTransfer]);
                            _a = firstPage.previousPage;
                            if (!_a) return [3 /*break*/, 3];
                            return [4 /*yield*/, firstPage.previousPage()];
                        case 2:
                            _a = (_c.sent());
                            _c.label = 3;
                        case 3:
                            secondPage = _a;
                            chai_1.expect((_b = secondPage) === null || _b === void 0 ? void 0 : _b.items).to.deep.equal([firstTransfer]);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=transfer.spec.js.map