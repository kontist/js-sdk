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
var types_1 = require("../types");
var errors_1 = require("../errors");
exports.PUSH_CHALLENGE_PATH = "/api/user/mfa/challenges";
var CHALLENGE_POLL_INTERVAL = 3000;
var PushNotificationMFA = /** @class */ (function () {
    /**
     * @param tokenManager  TokenManager instance
     * @param request       HttpRequest instance used to make requests
     *                      against Kontist REST API
     */
    function PushNotificationMFA(tokenManager, request) {
        var _this = this;
        this.challengePollInterval = CHALLENGE_POLL_INTERVAL;
        this.rejectConfirmation = null;
        /**
         * Called by `getConfirmedToken`. Calls itself periodically
         * until the challenge expires or its status is updated
         */
        this.pollChallengeStatus = function (pendingChallenge, resolve, reject) { return function () { return __awaiter(_this, void 0, void 0, function () {
            var challenge, error_1, hasExpired, wasDenied, wasVerified, confirmedToken, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.request.fetch(exports.PUSH_CHALLENGE_PATH + "/" + pendingChallenge.id, types_1.HttpMethod.GET)];
                    case 1:
                        challenge = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [2 /*return*/, reject(error_1)];
                    case 3:
                        this.rejectConfirmation = null;
                        hasExpired = new Date(challenge.expiresAt) < new Date();
                        wasDenied = challenge.status === types_1.PushChallengeStatus.DENIED;
                        wasVerified = challenge.status === types_1.PushChallengeStatus.VERIFIED;
                        if (!hasExpired) return [3 /*break*/, 4];
                        return [2 /*return*/, reject(new errors_1.ChallengeExpiredError())];
                    case 4:
                        if (!wasDenied) return [3 /*break*/, 5];
                        return [2 /*return*/, reject(new errors_1.ChallengeDeniedError())];
                    case 5:
                        if (!wasVerified) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.request.fetch(exports.PUSH_CHALLENGE_PATH + "/" + challenge.id + "/token", types_1.HttpMethod.POST)];
                    case 6:
                        confirmedToken = (_a.sent()).token;
                        token = this.tokenManager.setToken(confirmedToken);
                        return [2 /*return*/, resolve(token)];
                    case 7:
                        this.rejectConfirmation = reject;
                        this.challengePollTimeoutId = setTimeout(this.pollChallengeStatus(pendingChallenge, resolve, reject), this.challengePollInterval);
                        return [2 /*return*/];
                }
            });
        }); }; };
        /**
         * Create an MFA challenge and request a confirmed access token when verified
         */
        this.getConfirmedToken = function () { return __awaiter(_this, void 0, void 0, function () {
            var challenge;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.request.fetch(exports.PUSH_CHALLENGE_PATH, types_1.HttpMethod.POST)];
                    case 1:
                        challenge = _a.sent();
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                return _this.pollChallengeStatus(challenge, resolve, reject)();
                            })];
                }
            });
        }); };
        /**
         * Clear pending MFA confirmation
         */
        this.cancelConfirmation = function () {
            clearTimeout(_this.challengePollTimeoutId);
            if (typeof _this.rejectConfirmation === "function") {
                _this.rejectConfirmation(new errors_1.MFAConfirmationCanceledError());
            }
        };
        this.request = request;
        this.tokenManager = tokenManager;
    }
    return PushNotificationMFA;
}());
exports.PushNotificationMFA = PushNotificationMFA;
//# sourceMappingURL=push.js.map