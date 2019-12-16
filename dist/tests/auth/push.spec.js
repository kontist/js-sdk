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
var moment = require("moment");
var push_1 = require("../../lib/auth/push");
var types_1 = require("../../lib/types");
var helpers_1 = require("../helpers");
describe("Auth: PushNotificationMFA", function () {
    describe("#getConfirmedToken", function () {
        var setup = function (updatedChallenge) {
            var challenge = {
                id: "35f31e77-467a-472a-837b-c34ad3c8a9b4",
                status: types_1.PushChallengeStatus.PENDING,
                expiresAt: moment().add(10, "minutes")
            };
            var confirmedToken = "cnf-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
            var client = helpers_1.createClient();
            client.auth.push["challengePollInterval"] = 0;
            var requestStub = sinon.stub(client.auth.push["request"], "fetch");
            requestStub
                .withArgs(push_1.PUSH_CHALLENGE_PATH, types_1.HttpMethod.POST)
                .resolves(challenge);
            requestStub
                .withArgs(push_1.PUSH_CHALLENGE_PATH + "/" + challenge.id, types_1.HttpMethod.GET)
                .onFirstCall()
                .resolves(challenge)
                .onSecondCall()
                .resolves(__assign(__assign({}, challenge), updatedChallenge));
            requestStub
                .withArgs(push_1.PUSH_CHALLENGE_PATH + "/" + challenge.id + "/token", types_1.HttpMethod.POST)
                .resolves({
                token: confirmedToken
            });
            return { requestStub: requestStub, confirmedToken: confirmedToken, client: client };
        };
        describe("when challenge is verified", function () {
            it("should set and return confirmed access token", function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, requestStub, confirmedToken, client, response;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = setup({
                                status: types_1.PushChallengeStatus.VERIFIED
                            }), requestStub = _a.requestStub, confirmedToken = _a.confirmedToken, client = _a.client;
                            return [4 /*yield*/, client.auth.push.getConfirmedToken()];
                        case 1:
                            response = _b.sent();
                            chai_1.expect(requestStub.callCount).to.equal(4);
                            chai_1.expect(response.accessToken).to.equal(confirmedToken);
                            chai_1.expect(client.auth.tokenManager.token && client.auth.tokenManager.token.accessToken).to.equal(confirmedToken);
                            requestStub.restore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("when challenge is denied", function () {
            it("should throw a `Challenge denied` error", function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, requestStub, client, error, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = setup({
                                status: types_1.PushChallengeStatus.DENIED
                            }), requestStub = _a.requestStub, client = _a.client;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, client.auth.push.getConfirmedToken()];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_1 = _b.sent();
                            error = err_1;
                            return [3 /*break*/, 4];
                        case 4:
                            chai_1.expect(requestStub.callCount).to.equal(3);
                            chai_1.expect(error.message).to.equal("Challenge denied");
                            chai_1.expect(error.name).to.equal("ChallengeDeniedError");
                            requestStub.restore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("when challenge is expired", function () {
            it("should throw a `Challenge expired` error", function () { return __awaiter(void 0, void 0, void 0, function () {
                var _a, requestStub, client, error, err_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = setup({
                                expiresAt: moment().subtract(2, "minutes")
                            }), requestStub = _a.requestStub, client = _a.client;
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, client.auth.push.getConfirmedToken()];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            err_2 = _b.sent();
                            error = err_2;
                            return [3 /*break*/, 4];
                        case 4:
                            chai_1.expect(requestStub.callCount).to.equal(3);
                            chai_1.expect(error.message).to.equal("Challenge expired");
                            chai_1.expect(error.name).to.equal("ChallengeExpiredError");
                            requestStub.restore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe("#cancelConfirmation", function () {
        it("should cancel polling and reject the corresponding promise", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, requestStub, clearTimeoutSpy, error, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = helpers_1.createClient();
                        requestStub = sinon
                            .stub(client.auth.push["request"], "fetch")
                            .resolves({
                            id: "35f31e77-467a-472a-837b-c34ad3c8a9b4",
                            status: types_1.PushChallengeStatus.PENDING,
                            expiresAt: moment().add(10, "minutes")
                        });
                        clearTimeoutSpy = sinon.spy(global, "clearTimeout");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        setTimeout(function () {
                            client.auth.push.cancelConfirmation();
                        }, 100);
                        return [4 /*yield*/, client.auth.push.getConfirmedToken()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        error = err_3;
                        return [3 /*break*/, 4];
                    case 4:
                        chai_1.expect(clearTimeoutSpy.callCount).to.equal(1);
                        chai_1.expect(error.message).to.equal("MFA confirmation canceled");
                        chai_1.expect(error.name).to.equal("MFAConfirmationCanceledError");
                        requestStub.restore();
                        clearTimeoutSpy.restore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=push.spec.js.map