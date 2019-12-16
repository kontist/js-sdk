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
var resultPage_1 = require("./resultPage");
var iterableModel_1 = require("./iterableModel");
var TRANSFER_FIELDS = "\n  id\n  recipient\n  iban\n  amount\n  status\n  executeAt\n  lastExecutionDate\n  purpose\n  e2eId\n  reoccurrence\n  nextOccurrence\n";
var CREATE_TRANSFER = "mutation createTransfer($transfer: CreateTransferInput!) {\n  createTransfer(transfer: $transfer) {\n    confirmationId\n  }\n}";
var CONFIRM_TRANSFER = "mutation confirmTransfer(\n  $confirmationId: String!\n  $authorizationToken: String!\n) {\n  confirmTransfer(\n    confirmationId: $confirmationId\n    authorizationToken: $authorizationToken\n  ) {\n    " + TRANSFER_FIELDS + "\n  }\n}";
var CREATE_TRANSFERS = "mutation($transfers: [CreateSepaTransferInput!]!) {\n  createTransfers(transfers: $transfers) {\n    confirmationId\n  }\n}";
var CONFIRM_TRANSFERS = "mutation confirmTransfer(\n  $confirmationId: String!\n  $authorizationToken: String!\n) {\n  confirmTransfers(\n    confirmationId: $confirmationId\n    authorizationToken: $authorizationToken\n  ) {\n    id\n    status\n    transfers {\n      id\n      status\n      recipient\n      iban\n      purpose\n      amount\n      e2eId\n    }\n  }\n}";
var CANCEL_TRANSFER = "mutation cancelTransfer($type: TransferType!, $id: String!) {\n  cancelTransfer(type: $type, id: $id) {\n    ... on ConfirmationRequest {\n      confirmationId\n    }\n\n    ... on Transfer {\n      " + TRANSFER_FIELDS + "\n    }\n  }\n}";
var CONFIRM_CANCEL_TRANSFER = "mutation confirmCancelTransfer(\n  $type: TransferType!\n  $confirmationId: String!\n  $authorizationToken: String!\n) {\n  confirmCancelTransfer(\n    type: $type\n    confirmationId: $confirmationId\n    authorizationToken: $authorizationToken\n  ) {\n    " + TRANSFER_FIELDS + "\n  }\n}";
var FETCH_TRANSFERS = "\n  query fetchTransfers (\n    $type: TransferType!,\n    $where: TransfersConnectionFilter,\n    $first: Int,\n    $last: Int,\n    $after: String,\n    $before: String\n  ) {\n    viewer {\n      mainAccount {\n      transfers(\n        type: $type,\n        where: $where,\n        first: $first,\n        last: $last,\n        after: $after,\n        before: $before\n      ) {\n          edges {\n            node {\n              " + TRANSFER_FIELDS + "\n            }\n          }\n          pageInfo {\n            hasNextPage\n            hasPreviousPage\n            startCursor\n            endCursor\n          }\n        }\n      }\n    }\n  }\n";
var Transfer = /** @class */ (function (_super) {
    __extends(Transfer, _super);
    function Transfer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Creates single wire transfer / timed order / standing order
     *
     * @param transfer  transfer data including at least recipient, IBAN and amount
     * @returns         confirmation id used to confirm the transfer
     */
    Transfer.prototype.createOne = function (transfer) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(CREATE_TRANSFER, { transfer: transfer })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.createTransfer.confirmationId];
                }
            });
        });
    };
    /**
     * Creates single wire transfer / timed order / standing order
     *
     * @param confirmationId      confirmation id obtained as a result of `transfer.createOne` call
     * @param authorizationToken  sms token
     * @returns                   confirmed wire transfer
     */
    Transfer.prototype.confirmOne = function (confirmationId, authorizationToken) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(CONFIRM_TRANSFER, {
                            confirmationId: confirmationId,
                            authorizationToken: authorizationToken
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.confirmTransfer];
                }
            });
        });
    };
    /**
     * Creates multiple wire transfers which can be later confirmed with single `authorizationToken`
     *
     * @param transfers   array of transfers data including at least recipient, IBAN and amount
     * @returns           confirmation id used to confirm the transfer
     */
    Transfer.prototype.createMany = function (transfers) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(CREATE_TRANSFERS, { transfers: transfers })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.createTransfers.confirmationId];
                }
            });
        });
    };
    /**
     * Confirms multiple transfers with single `authorizationToken`
     *
     * @param confirmationId      confirmation id obtained as a result of `transfer.createMany` call
     * @param authorizationToken  sms token
     * @returns                   batch transfer result
     */
    Transfer.prototype.confirmMany = function (confirmationId, authorizationToken) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(CONFIRM_TRANSFERS, {
                            confirmationId: confirmationId,
                            authorizationToken: authorizationToken
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.confirmTransfers];
                }
            });
        });
    };
    /**
     * Cancel transfer
     *
     * @param type      transfer type
     * @param id        transfer id
     * @returns         confirmation id used to confirm the cancellation or transfer if confirmation is not needed
     */
    Transfer.prototype.cancelTransfer = function (type, id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(CANCEL_TRANSFER, { type: type, id: id })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.cancelTransfer];
                }
            });
        });
    };
    /**
     * Confirm transfer cancellation
     *
     * @param type                transfer type
     * @param confirmationId      confirmation id obtained as a result of `transfer.cancelTransfer` call
     * @param authorizationToken  sms token
     * @returns                   canceled transfer
     */
    Transfer.prototype.confirmCancelTransfer = function (type, confirmationId, authorizationToken) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(CONFIRM_CANCEL_TRANSFER, {
                            type: type,
                            confirmationId: confirmationId,
                            authorizationToken: authorizationToken
                        })];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.confirmCancelTransfer];
                }
            });
        });
    };
    /**
     * Fetches first 50 transfers of provided type which match the query
     *
     * @param args  query parameters
     * @returns     result page
     */
    Transfer.prototype.fetch = function (args) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function () {
            var result, transfers, pageInfo;
            return __generator(this, function (_l) {
                switch (_l.label) {
                    case 0: return [4 /*yield*/, this.client.rawQuery(FETCH_TRANSFERS, args)];
                    case 1:
                        result = _l.sent();
                        transfers = (_e = (_d = (_c = (_b = (_a = result) === null || _a === void 0 ? void 0 : _a.viewer) === null || _b === void 0 ? void 0 : _b.mainAccount) === null || _c === void 0 ? void 0 : _c.transfers) === null || _d === void 0 ? void 0 : _d.edges, (_e !== null && _e !== void 0 ? _e : [])).map(function (edge) { return edge.node; });
                        pageInfo = (_k = (_j = (_h = (_g = (_f = result) === null || _f === void 0 ? void 0 : _f.viewer) === null || _g === void 0 ? void 0 : _g.mainAccount) === null || _h === void 0 ? void 0 : _h.transfers) === null || _j === void 0 ? void 0 : _j.pageInfo, (_k !== null && _k !== void 0 ? _k : {
                            hasNextPage: false,
                            hasPreviousPage: false
                        }));
                        return [2 /*return*/, new resultPage_1.ResultPage(this, transfers, pageInfo, args)];
                }
            });
        });
    };
    return Transfer;
}(iterableModel_1.IterableModel));
exports.Transfer = Transfer;
//# sourceMappingURL=transfer.js.map