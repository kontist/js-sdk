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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
require("cross-fetch/polyfill");
var lib_1 = require("../../lib");
var account_1 = require("../../lib/graphql/account");
var errors_1 = require("../../lib/errors");
describe("Account", function () {
    var sandbox;
    var client;
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var clientId, redirectUri, scopes, state;
        return __generator(this, function (_a) {
            sandbox = sinon.createSandbox();
            clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
            redirectUri = "https://localhost:3000/auth/callback";
            scopes = ["transactions"];
            state = "25843739712322056";
            client = new lib_1.Client({
                clientId: clientId,
                redirectUri: redirectUri,
                scopes: scopes,
                state: state
            });
            return [2 /*return*/];
        });
    }); });
    afterEach(function () {
        sandbox.restore();
    });
    describe("#fetch", function () {
        it("should fail", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, error, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = new account_1.Account(client.graphQL);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, account.fetch()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        error = e_1;
                        return [3 /*break*/, 4];
                    case 4:
                        // assert
                        chai_1.expect(error).to.be.an.instanceOf(errors_1.KontistSDKError);
                        chai_1.expect(error.message).to.eq("You are allowed only to fetch your account details.");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#get", function () {
        it("should call rawQuery and return mainAccount", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, spyOnRawQuery, result;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        account = new account_1.Account(client.graphQL);
                        spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
                            viewer: {
                                mainAccount: {
                                    iban: "DE1234",
                                    balance: 1234
                                }
                            }
                        });
                        return [4 /*yield*/, account.get()];
                    case 1:
                        result = _c.sent();
                        // assert
                        sinon.assert.calledOnce(spyOnRawQuery);
                        chai_1.expect((_a = result) === null || _a === void 0 ? void 0 : _a.iban).to.eq("DE1234");
                        chai_1.expect((_b = result) === null || _b === void 0 ? void 0 : _b.balance).to.eq(1234);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should call rawQuery and return null for empty account", function () { return __awaiter(void 0, void 0, void 0, function () {
            var account, spyOnRawQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        account = new account_1.Account(client.graphQL);
                        spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
                            viewer: {}
                        });
                        return [4 /*yield*/, account.get()];
                    case 1:
                        result = _a.sent();
                        // assert
                        sinon.assert.calledOnce(spyOnRawQuery);
                        chai_1.expect(result).to.eq(null);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=account.spec.js.map