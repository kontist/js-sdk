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
var schema_1 = require("../../lib/graphql/schema");
var lib_1 = require("../../lib");
var card_1 = require("../../lib/graphql/card");
var cardData = {
    id: "010e5dcfdd7949fea50a510e97157168",
    status: schema_1.CardStatus.Inactive,
    type: schema_1.CardType.VisaBusinessDebit,
    holder: "JEAN DUPONT",
    formattedExpirationDate: "12/22",
    maskedPan: "6802********5119",
    pinSet: false,
    settings: {
        contactlessEnabled: true
    }
};
describe("Card", function () {
    var sandbox;
    var client;
    var confirmationId = "71c7ecca-7763-4d9a-a54f-49924d7505f5";
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
        it("should call rawQuery and return all cards details", function () { return __awaiter(void 0, void 0, void 0, function () {
            var cardsData, card, spyOnRawQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cardsData = [
                            cardData,
                            __assign(__assign({}, cardData), { id: "010e5dcfdd7949fea50a510e97157169" })
                        ];
                        card = new card_1.Card(client.graphQL);
                        spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
                            viewer: {
                                mainAccount: {
                                    cards: [
                                        cardData,
                                        __assign(__assign({}, cardData), { id: "010e5dcfdd7949fea50a510e97157169" })
                                    ]
                                }
                            }
                        });
                        return [4 /*yield*/, card.fetch()];
                    case 1:
                        result = _a.sent();
                        // assert
                        sinon.assert.calledOnce(spyOnRawQuery);
                        chai_1.expect(result).to.deep.eq({
                            items: cardsData,
                            pageInfo: {
                                hasNextPage: false,
                                hasPreviousPage: false
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#get", function () {
        it("should call rawQuery and return card details", function () { return __awaiter(void 0, void 0, void 0, function () {
            var card, spyOnRawQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        card = new card_1.Card(client.graphQL);
                        spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
                            viewer: {
                                mainAccount: {
                                    card: cardData
                                }
                            }
                        });
                        return [4 /*yield*/, card.get({
                                id: cardData.id,
                                type: schema_1.CardType.VisaBusinessDebit
                            })];
                    case 1:
                        result = _a.sent();
                        // assert
                        sinon.assert.calledOnce(spyOnRawQuery);
                        chai_1.expect(result).to.deep.eq(cardData);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should call rawQuery and return null for missing account", function () { return __awaiter(void 0, void 0, void 0, function () {
            var card, spyOnRawQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        card = new card_1.Card(client.graphQL);
                        spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
                            viewer: {}
                        });
                        return [4 /*yield*/, card.get({
                                id: cardData.id,
                                type: schema_1.CardType.MastercardBusinessDebit
                            })];
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
    describe("#create", function () {
        it("should call rawQuery and return newly created card details", function () { return __awaiter(void 0, void 0, void 0, function () {
            var card, spyOnRawQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        card = new card_1.Card(client.graphQL);
                        spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
                            createCard: cardData
                        });
                        return [4 /*yield*/, card.create({
                                type: schema_1.CardType.VisaBusinessDebit
                            })];
                    case 1:
                        result = _a.sent();
                        // assert
                        sinon.assert.calledOnce(spyOnRawQuery);
                        chai_1.expect(result).to.deep.eq(cardData);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#activate", function () {
        it("should call rawQuery and return activated card", function () { return __awaiter(void 0, void 0, void 0, function () {
            var activatedCardData, card, spyOnRawQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        activatedCardData = __assign(__assign({}, cardData), { status: schema_1.CardStatus.Active });
                        card = new card_1.Card(client.graphQL);
                        spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
                            activateCard: activatedCardData
                        });
                        return [4 /*yield*/, card.activate({
                                id: cardData.id,
                                verificationToken: "7AOXBQ"
                            })];
                    case 1:
                        result = _a.sent();
                        // assert
                        sinon.assert.calledOnce(spyOnRawQuery);
                        chai_1.expect(result).to.deep.eq(activatedCardData);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#changePIN", function () {
        it("should call rawQuery and return confirmationId", function () { return __awaiter(void 0, void 0, void 0, function () {
            var card, spyOnRawQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        card = new card_1.Card(client.graphQL);
                        spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
                            changeCardPIN: {
                                confirmationId: confirmationId
                            }
                        });
                        return [4 /*yield*/, card.changePIN({
                                id: cardData.id,
                                pin: "9164"
                            })];
                    case 1:
                        result = _a.sent();
                        // assert
                        sinon.assert.calledOnce(spyOnRawQuery);
                        chai_1.expect(result).to.eq(confirmationId);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#confirmChangePIN", function () {
        it("should call rawQuery and return status", function () { return __awaiter(void 0, void 0, void 0, function () {
            var status, card, spyOnRawQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        status = "COMPLETED";
                        card = new card_1.Card(client.graphQL);
                        spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
                            confirmChangeCardPIN: {
                                status: status
                            }
                        });
                        return [4 /*yield*/, card.confirmChangePIN({
                                id: cardData.id,
                                authorizationToken: "090402",
                                confirmationId: confirmationId
                            })];
                    case 1:
                        result = _a.sent();
                        // assert
                        sinon.assert.calledOnce(spyOnRawQuery);
                        chai_1.expect(result).to.eq(status);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#changeStatus", function () {
        it("should call rawQuery and return updated card details", function () { return __awaiter(void 0, void 0, void 0, function () {
            var updatedCardData, card, spyOnRawQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedCardData = __assign(__assign({}, cardData), { status: schema_1.CardStatus.Blocked });
                        card = new card_1.Card(client.graphQL);
                        spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
                            changeCardStatus: updatedCardData
                        });
                        return [4 /*yield*/, card.changeStatus({
                                id: cardData.id,
                                action: schema_1.CardAction.Block
                            })];
                    case 1:
                        result = _a.sent();
                        // assert
                        sinon.assert.calledOnce(spyOnRawQuery);
                        chai_1.expect(result).to.eq(updatedCardData);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#updateSettings", function () {
        it("should call rawQuery and return updated card details", function () { return __awaiter(void 0, void 0, void 0, function () {
            var updatedCardSettings, card, spyOnRawQuery, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updatedCardSettings = {
                            contactlessEnabled: false,
                            cardNotPresentLimits: {
                                daily: {
                                    maxAmountCents: 350000,
                                    maxTransactions: 34
                                },
                                monthly: {
                                    maxAmountCents: 2000000,
                                    maxTransactions: 777
                                }
                            },
                            cardPresentLimits: {
                                daily: {
                                    maxAmountCents: 440000,
                                    maxTransactions: 14
                                },
                                monthly: {
                                    maxAmountCents: 2600000,
                                    maxTransactions: 468
                                }
                            }
                        };
                        card = new card_1.Card(client.graphQL);
                        spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
                            updateCardSettings: updatedCardSettings
                        });
                        return [4 /*yield*/, card.updateSettings(__assign({ id: cardData.id }, updatedCardSettings))];
                    case 1:
                        result = _a.sent();
                        // assert
                        sinon.assert.calledOnce(spyOnRawQuery);
                        chai_1.expect(result).to.eq(updatedCardSettings);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=card.spec.js.map