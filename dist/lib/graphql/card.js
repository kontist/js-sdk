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
var model_1 = require("./model");
var resultPage_1 = require("./resultPage");
var CARD_FIELDS = "\n  id\n  status\n  type\n  holder\n  formattedExpirationDate\n  maskedPan\n  pinSet\n  detailsUrl\n  settings {\n    contactlessEnabled\n  }\n";
var CARD_LIMITS_FIELDS = "\n  daily {\n    maxAmountCents\n    maxTransactions\n  }\n  monthly {\n    maxAmountCents\n    maxTransactions\n  }\n";
var GET_CARDS = "query {\n  viewer {\n    mainAccount {\n      cards {\n        " + CARD_FIELDS + "\n      }\n    }\n  }\n}";
var GET_CARD = "\n  query getCard (\n    $id: String,\n    $type: CardType\n  ) {\n    viewer {\n      mainAccount {\n        card(\n          filter: {\n            id: $id,\n            type: $type\n          }\n        ) {\n          " + CARD_FIELDS + "\n        }\n      }\n    }\n  }\n";
var GET_CARD_LIMITS = "\n  query getCardLimits (\n    $id: String,\n    $type: CardType\n  ) {\n    viewer {\n      mainAccount {\n        card(\n          filter: {\n            id: $id,\n            type: $type\n          }\n        ) {\n          settings {\n            cardPresentLimits {\n              " + CARD_LIMITS_FIELDS + "\n            }\n            cardNotPresentLimits {\n              " + CARD_LIMITS_FIELDS + "\n            }\n          }\n        }\n      }\n    }\n  }\n";
var CREATE_CARD = "mutation createCard(\n  $type: CardType!\n) {\n  createCard(\n    type: $type\n  ) {\n    " + CARD_FIELDS + "\n  }\n}";
var ACTIVATE_CARD = "mutation activateCard(\n  $id: String!\n  $verificationToken: String!\n) {\n  activateCard(\n    id: $id\n    verificationToken: $verificationToken\n  ) {\n    " + CARD_FIELDS + "\n  }\n}";
var CHANGE_CARD_PIN = "mutation changeCardPIN(\n  $id: String!\n  $pin: String!\n) {\n  changeCardPIN(\n    id: $id\n    pin: $pin\n  ) {\n    confirmationId\n  }\n}";
var CONFIRM_CHANGE_CARD_PIN = "mutation confirmChangeCardPIN(\n  $id: String!\n  $confirmationId: String!\n  $authorizationToken: String!\n) {\n  confirmChangeCardPIN(\n    id: $id\n    confirmationId: $confirmationId\n    authorizationToken: $authorizationToken\n  ) {\n    status\n  }\n}";
var CHANGE_CARD_STATUS = "mutation changeCardStatus(\n  $id: String!\n  $action: CardAction!\n) {\n  changeCardStatus(\n    id: $id\n    action: $action\n  ) {\n    " + CARD_FIELDS + "\n  }\n}";
var UPDATE_CARD_SETTINGS = "mutation updateCardSettings(\n  $id: String!\n  $contactlessEnabled: Boolean\n  $cardPresentLimits: CardLimitsInput\n  $cardNotPresentLimits: CardLimitsInput\n) {\n  updateCardSettings(\n    settings: {\n      contactlessEnabled: $contactlessEnabled\n      cardPresentLimits: $cardPresentLimits\n      cardNotPresentLimits: $cardNotPresentLimits\n    }\n    id: $id\n  ) {\n    contactlessEnabled\n    cardNotPresentLimits {\n      " + CARD_LIMITS_FIELDS + "\n    }\n    cardPresentLimits {\n      " + CARD_LIMITS_FIELDS + "\n    }\n  }\n}";
var Card = /** @class */ (function (_super) {
    __extends(Card, _super);
    function Card() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Fetches all cards belonging to the current user
     *
     * @returns     result page
     */
    Card.prototype.fetch = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var result, cards, pageInfo;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(GET_CARDS)];
                    case 1:
                        result = _c.sent();
                        cards = (_b = (_a = result.viewer.mainAccount) === null || _a === void 0 ? void 0 : _a.cards, (_b !== null && _b !== void 0 ? _b : []));
                        pageInfo = {
                            hasNextPage: false,
                            hasPreviousPage: false
                        };
                        return [2 /*return*/, new resultPage_1.ResultPage(this, cards, pageInfo, {})];
                }
            });
        });
    };
    /**
     * Returns details of a specific card belonging to the current user
     *
     * @param args  query parameters including card id and / or type
     * @returns     details of the card specified in query parameters
     */
    Card.prototype.get = function (args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(GET_CARD, args)];
                    case 1:
                        result = _c.sent();
                        return [2 /*return*/, (_b = (_a = result.viewer.mainAccount) === null || _a === void 0 ? void 0 : _a.card, (_b !== null && _b !== void 0 ? _b : null))];
                }
            });
        });
    };
    /**
     * Returns limits of a specific card belonging to the current user
     *
     * @param args  query parameters including card id and / or type
     * @returns     limits of the card
     */
    Card.prototype.getLimits = function (args) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(GET_CARD_LIMITS, args)];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, (_c = (_b = (_a = result.viewer.mainAccount) === null || _a === void 0 ? void 0 : _a.card) === null || _b === void 0 ? void 0 : _b.settings, (_c !== null && _c !== void 0 ? _c : null))];
                }
            });
        });
    };
    /**
     * Creates a card
     *
     * @param args   query parameters including cardType
     * @returns      the newly created card details
     */
    Card.prototype.create = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(CREATE_CARD, args)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.createCard];
                }
            });
        });
    };
    /**
     * Activates a card
     *
     * @param args  query parameters including card id and verificationToken
     * @returns     activated card details
     */
    Card.prototype.activate = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(ACTIVATE_CARD, args)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.activateCard];
                }
            });
        });
    };
    /**
     * Initiates a change of PIN number for a given card
     *
     * @param args   query parameters including card id and PIN number
     * @returns      confirmation id used to confirm the PIN change
     */
    Card.prototype.changePIN = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(CHANGE_CARD_PIN, args)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.changeCardPIN.confirmationId];
                }
            });
        });
    };
    /**
     * Confirms a requested PIN number change
     *
     * @param args   query parameters including card id and PIN number
     * @returns      PIN number change status
     */
    Card.prototype.confirmChangePIN = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(CONFIRM_CHANGE_CARD_PIN, args)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.confirmChangeCardPIN.status];
                }
            });
        });
    };
    /**
     * Change a card status
     *
     * @param args   query parameters including card id and action
     * @returns      updated card details
     */
    Card.prototype.changeStatus = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(CHANGE_CARD_STATUS, args)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.changeCardStatus];
                }
            });
        });
    };
    /**
     * Update settings for a card
     *
     * @param args   query parameters including card id, contactlessEnabled, cardPresentLimits and cardNotPresentLimits
     * @returns      updated card settings
     */
    Card.prototype.updateSettings = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(UPDATE_CARD_SETTINGS, args)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.updateCardSettings];
                }
            });
        });
    };
    return Card;
}(model_1.Model));
exports.Card = Card;
//# sourceMappingURL=card.js.map