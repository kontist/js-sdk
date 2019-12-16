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
var ClientOAuth2 = require("client-oauth2");
var lib_1 = require("../../lib");
var utils = require("../../lib/utils");
var helpers_1 = require("../helpers");
describe("Auth: TokenManager", function () {
    var verifier = "Huag6ykQU7SaEYKtmNUeM8txt4HzEIfG";
    var clientSecret = "very-secret";
    describe("#getAuthUri", function () {
        it("should return proper redirect url when clientSecret is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, url, expectedUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = helpers_1.createClient({ clientSecret: clientSecret });
                        return [4 /*yield*/, client.auth.tokenManager.getAuthUri()];
                    case 1:
                        url = _a.sent();
                        expectedUrl = lib_1.Constants.KONTIST_API_BASE_URL + "/api/oauth/authorize?client_id=" + helpers_1.clientId + "&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scope=transactions&response_type=code&state=25843739712322056";
                        chai_1.expect(url).to.equal(expectedUrl);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should return proper redirect url when code verifier is provided", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, codeChallenge, codeChallengeMethod, url, expectedUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = helpers_1.createClient({ verifier: verifier });
                        codeChallenge = "xc3uY4-XMuobNWXzzfEqbYx3rUYBH69_zu4EFQIJH8w";
                        codeChallengeMethod = "S256";
                        return [4 /*yield*/, client.auth.tokenManager.getAuthUri()];
                    case 1:
                        url = _a.sent();
                        expectedUrl = lib_1.Constants.KONTIST_API_BASE_URL + "/api/oauth/authorize?client_id=" + helpers_1.clientId + "&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scope=transactions&response_type=code&state=25843739712322056&code_challenge=" + codeChallenge + "&code_challenge_method=" + codeChallengeMethod;
                        chai_1.expect(url).to.equal(expectedUrl);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#fetchToken", function () {
        var callbackUrl = helpers_1.redirectUri + "?code=a253a28a749cb31e7ba7487b9e240b53f6783317&state=25843739712322056";
        var tokenResponseData = {
            access_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            refresh_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1",
            token_type: "Bearer"
        };
        var oauthClient;
        var tokenData;
        beforeEach(function () {
            oauthClient = new ClientOAuth2({});
            sinon.stub(oauthClient.code, "getToken").callsFake(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new ClientOAuth2.Token(oauthClient, tokenResponseData)];
                });
            }); });
        });
        describe("for code verifier", function () {
            beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                var client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client = helpers_1.createClient({ verifier: verifier, oauthClient: oauthClient });
                            return [4 /*yield*/, client.auth.tokenManager.fetchToken(callbackUrl)];
                        case 1:
                            tokenData = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("should call oauthClient.code.getToken() with proper arguments", function () {
                var stub = oauthClient.code.getToken;
                var _a = stub.getCall(0).args, url = _a[0], opts = _a[1];
                chai_1.expect(url).to.equal(callbackUrl);
                chai_1.expect(opts).to.deep.equal({
                    body: {
                        code_verifier: verifier
                    }
                });
            });
            it("should return token data", function () {
                chai_1.expect(tokenData.data).to.deep.equal(tokenResponseData);
            });
        });
        describe("for client secret", function () {
            beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
                var client;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            client = helpers_1.createClient({ clientSecret: clientSecret, oauthClient: oauthClient });
                            return [4 /*yield*/, client.auth.tokenManager.fetchToken(callbackUrl)];
                        case 1:
                            tokenData = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("should call oauthClient.code.getToken() with an empty object", function () {
                var stub = oauthClient.code.getToken;
                var _a = stub.getCall(0).args, url = _a[0], opts = _a[1];
                chai_1.expect(url).to.equal(callbackUrl);
                chai_1.expect(opts).to.deep.equal({});
            });
            it("should return token data", function () {
                chai_1.expect(tokenData.data).to.deep.equal(tokenResponseData);
            });
        });
    });
    describe("#fetchTokenFromCredentials", function () {
        var username = "user@kontist.com";
        var password = "test1234";
        var scopes = ["transfers"];
        var tokenResponseData = {
            access_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            token_type: "Bearer"
        };
        var oauthClient;
        var client;
        beforeEach(function () {
            oauthClient = new ClientOAuth2({});
            sinon.stub(oauthClient.owner, "getToken").callsFake(function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new ClientOAuth2.Token(oauthClient, tokenResponseData)];
                });
            }); });
            client = helpers_1.createClient({ oauthClient: oauthClient });
        });
        it("should call oauthClient.owner.getToken() with proper arguments", function () { return __awaiter(void 0, void 0, void 0, function () {
            var stub, args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.auth.tokenManager.fetchTokenFromCredentials({ username: username, password: password })];
                    case 1:
                        _a.sent();
                        stub = oauthClient.owner.getToken;
                        args = stub.getCall(0).args;
                        chai_1.expect(args).to.deep.equal([username, password, {}]);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should return token data", function () { return __awaiter(void 0, void 0, void 0, function () {
            var tokenData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.auth.tokenManager.fetchTokenFromCredentials({
                            username: username,
                            password: password
                        })];
                    case 1:
                        tokenData = _a.sent();
                        chai_1.expect(tokenData.data).to.deep.equal(tokenResponseData);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should forward `scopes` to oauthClient.owner.getToken() when set", function () { return __awaiter(void 0, void 0, void 0, function () {
            var stub, args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.auth.tokenManager.fetchTokenFromCredentials({
                            username: username,
                            password: password,
                            scopes: scopes
                        })];
                    case 1:
                        _a.sent();
                        stub = oauthClient.owner.getToken;
                        args = stub.getCall(0).args;
                        chai_1.expect(args).to.deep.equal([username, password, { scopes: scopes }]);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#refresh", function () {
        describe("when client is created with a verifier", function () {
            var origin = "http://some.url";
            var code = "some-random-code";
            before(function () {
                global.window = {};
                global.document = {
                    location: {
                        origin: origin
                    }
                };
            });
            it("should request a silent authorization and fetch a new token", function () { return __awaiter(void 0, void 0, void 0, function () {
                var dummyToken, state, client, customTimeout, tokenResponseData, oauthClient, fetchTokenStub, silentAuthorizationStub, token, _a, firstArg, secondArg, thirdArg;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            dummyToken = "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
                            state = "some?state&with#uri=components";
                            client = helpers_1.createClient({
                                verifier: verifier,
                                state: state
                            });
                            customTimeout = 20000;
                            tokenResponseData = {
                                access_token: "dummy-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                                token_type: "Bearer"
                            };
                            oauthClient = new ClientOAuth2({});
                            fetchTokenStub = sinon
                                .stub(client.auth.tokenManager, "fetchToken")
                                .callsFake(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, new ClientOAuth2.Token(oauthClient, tokenResponseData)];
                                });
                            }); });
                            silentAuthorizationStub = sinon
                                .stub(utils, "authorizeSilently")
                                .resolves(code);
                            return [4 /*yield*/, client.auth.tokenManager.refresh(customTimeout)];
                        case 1:
                            token = _b.sent();
                            chai_1.expect(fetchTokenStub.callCount).to.equal(1);
                            chai_1.expect(fetchTokenStub.getCall(0).args[0]).to.equal(origin + "?code=" + code + "&state=" + encodeURIComponent(state));
                            chai_1.expect(silentAuthorizationStub.callCount).to.equal(1);
                            _a = silentAuthorizationStub.getCall(0).args, firstArg = _a[0], secondArg = _a[1], thirdArg = _a[2];
                            chai_1.expect(firstArg).to.include("prompt=none");
                            chai_1.expect(firstArg).to.include("response_mode=web_message");
                            chai_1.expect(secondArg).to.equal(lib_1.Constants.KONTIST_API_BASE_URL);
                            chai_1.expect(thirdArg).to.equal(customTimeout);
                            chai_1.expect(token.accessToken).to.equal(dummyToken);
                            fetchTokenStub.restore();
                            silentAuthorizationStub.restore();
                            return [2 /*return*/];
                    }
                });
            }); });
            after(function () {
                global.window = undefined;
                global.document = undefined;
            });
        });
        describe("when client is created with a clientSecret", function () {
            it("should request a new token using refresh token", function () { return __awaiter(void 0, void 0, void 0, function () {
                var oauthClient, client, tokenResponseData, clientOAuth2TokenRefreshStub;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            oauthClient = new ClientOAuth2({});
                            client = helpers_1.createClient({
                                oauthClient: oauthClient,
                                clientSecret: clientSecret
                            });
                            tokenResponseData = {
                                access_token: "dummy-access-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
                                refresh_token: "dummy-refresh-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ1",
                                token_type: "Bearer"
                            };
                            client.auth.tokenManager.setToken(tokenResponseData.access_token, tokenResponseData.refresh_token);
                            clientOAuth2TokenRefreshStub = sinon
                                .stub(ClientOAuth2.Token.prototype, "refresh")
                                .callsFake(function () { return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, new ClientOAuth2.Token(oauthClient, tokenResponseData)];
                                });
                            }); });
                            return [4 /*yield*/, client.auth.tokenManager.refresh()];
                        case 1:
                            _a.sent();
                            chai_1.expect(clientOAuth2TokenRefreshStub.callCount).to.equal(1);
                            clientOAuth2TokenRefreshStub.restore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe("#setToken", function () {
        it("should be able to set access token", function () {
            var client = helpers_1.createClient({ clientSecret: clientSecret });
            var accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNThmNzg5Ny03YzdlLTQzMWItYTY2MS0yMDYzNjE0YzM0YTYiLCJzY29wZSI6InRyYW5zYWN0aW9ucyIsImNsaWVudF9pZCI6IjI2OTkwMjE2LWUzNDAtNGY1NC1iNWE1LWRmOWJhYWNjMDQ0MSIsImlhdCI6MTU3MTMyNzYwOSwiZXhwIjoxNTcxMzMxMjA5fQ.JrDN1w5bh43QgV3buXQSlD5utk74NIXbOGETFPMJH6A";
            var refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNThmNzg5Ny03YzdlLTQzMWItYTY2MS0yMDYzNjE0YzM0YTYiLCJzY29wZSI6InJlZnJlc2ggdHJhbnNhY3Rpb25zIiwiY2xpZW50X2lkIjoiMjY5OTAyMTYtZTM0MC00ZjU0LWI1YTUtZGY5YmFhY2MwNDQxIiwiaWF0IjoxNTcxMzI3NjA5LCJleHAiOjE1NzEzMzQ4MDl9.HWSA7hB54WEznBaWzvZKwd_fXuLBQqD0kHugidkzW4U";
            var tokenType = "bearer";
            var token = client.auth.tokenManager.setToken(accessToken);
            chai_1.expect(token.accessToken).to.equal(accessToken);
            token = client.auth.tokenManager.setToken(accessToken, refreshToken);
            chai_1.expect(token.accessToken).to.equal(accessToken);
            chai_1.expect(token.refreshToken).to.equal(refreshToken);
            token = client.auth.tokenManager.setToken(accessToken, refreshToken, tokenType);
            chai_1.expect(token.accessToken).to.equal(accessToken);
            chai_1.expect(token.refreshToken).to.equal(refreshToken);
            chai_1.expect(token.tokenType).to.equal(tokenType);
        });
    });
});
//# sourceMappingURL=tokenManager.spec.js.map