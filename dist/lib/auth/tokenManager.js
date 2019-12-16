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
var js_sha256_1 = require("js-sha256");
var abab_1 = require("abab");
var utils_1 = require("../utils");
var errors_1 = require("../errors");
var DEFAULT_TOKEN_REFRESH_TIMEOUT = 10000;
var TokenManager = /** @class */ (function () {
    /**
     * @param baseUrl  Kontist API base url
     * @param opts     oauth2Client and optional state and verifier
     */
    function TokenManager(baseUrl, opts) {
        var _this = this;
        this._token = null;
        /**
         * Build a uri to which the user must be redirected for login.
         */
        this.getAuthUri = function (opts) {
            if (opts === void 0) { opts = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                var query, challenge;
                return __generator(this, function (_a) {
                    query = __assign({}, (opts.query || {}));
                    if (this.verifier) {
                        challenge = abab_1.btoa(String.fromCharCode.apply(null, js_sha256_1.sha256.array(this.verifier)))
                            .split("=")[0]
                            .replace("+", "-")
                            .replace("/", "_");
                        query.code_challenge = challenge;
                        query.code_challenge_method = "S256";
                    }
                    return [2 /*return*/, this.oauth2Client.code.getUri({ query: query })];
                });
            });
        };
        /**
         * This method must be called during the callback via `redirectUri`.
         *
         * @param callbackUri  `redirectUri` containing OAuth2 data after user authentication
         * @returns            token object which might contain token(s), scope(s), token type and expiration time
         */
        this.fetchToken = function (callbackUri) { return __awaiter(_this, void 0, void 0, function () {
            var options, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {};
                        if (this.verifier) {
                            options.body = {
                                code_verifier: this.verifier
                            };
                        }
                        return [4 /*yield*/, this.oauth2Client.code.getToken(callbackUri, options)];
                    case 1:
                        token = _a.sent();
                        this._token = token;
                        return [2 /*return*/, token];
                }
            });
        }); };
        /**
         * Fetches token from owner credentials.
         * Only works for client IDs that support the 'password' grant type
         *
         * @param options     Username, password, and an optional set of scopes
         *                    When given a set of scopes, they override the default list of
         *                    scopes of `this` intance
         *
         * @returns           token object which might contain token(s), scope(s), token type and expiration time
         */
        this.fetchTokenFromCredentials = function (options) { return __awaiter(_this, void 0, void 0, function () {
            var getTokenOpts, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getTokenOpts = options.scopes ? { scopes: options.scopes } : {};
                        return [4 /*yield*/, this.oauth2Client.owner.getToken(options.username, options.password, getTokenOpts)];
                    case 1:
                        token = _a.sent();
                        this._token = token;
                        return [2 /*return*/, token];
                }
            });
        }); };
        /**
         * Refresh auth token silently for browser environments
         * Renew auth token
         *
         * @param timeout  optional timeout for renewal in ms
         */
        this.refresh = function (timeout) {
            if (timeout === void 0) { timeout = DEFAULT_TOKEN_REFRESH_TIMEOUT; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.verifier
                            ? this.renewWithWebMessage(timeout)
                            : this.renewWithRefreshToken(timeout)];
                });
            });
        };
        /**
         * Renew auth token using refresh token
         *
         * @param timeout  timeout for renewal in ms
         */
        this.renewWithRefreshToken = function (timeout) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var timeoutId, token, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!this.token) {
                                        throw new errors_1.UserUnauthorizedError();
                                    }
                                    timeoutId = setTimeout(function () {
                                        reject(new errors_1.RenewTokenError({
                                            message: "Server did not respond with a new auth token, aborting."
                                        }));
                                    }, timeout);
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, this.token.refresh()];
                                case 2:
                                    token = _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _a.sent();
                                    return [2 /*return*/, reject(new errors_1.RenewTokenError({
                                            message: error_1.message
                                        }))];
                                case 4:
                                    clearTimeout(timeoutId);
                                    this._token = token;
                                    return [2 /*return*/, resolve(token)];
                            }
                        });
                    }); })];
            });
        }); };
        /**
         * Sets up  previously created token for all upcoming requests.
         *
         * @param accessToken   access token
         * @param refreshToken  optional refresh token
         * @param tokenType     token type
         * @returns             token object which might contain token(s), scope(s), token type and expiration time
         */
        this.setToken = function (accessToken, refreshToken, tokenType) {
            var data = {};
            var token;
            if (tokenType && refreshToken) {
                token = _this.oauth2Client.createToken(accessToken, refreshToken, tokenType, data);
            }
            else if (refreshToken) {
                token = _this.oauth2Client.createToken(accessToken, refreshToken, data);
            }
            else {
                token = _this.oauth2Client.createToken(accessToken, data);
            }
            _this._token = token;
            return token;
        };
        /**
         * Renew auth token for browser environments using web_message response mode and prompt none
         *
         * @param timeout  timeout for renewal in ms
         */
        this.renewWithWebMessage = function (timeout) { return __awaiter(_this, void 0, void 0, function () {
            var iframeUri, code, fetchTokenUri, token, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!document || !window) {
                            throw new errors_1.RenewTokenError({
                                message: "Web message token renewal is only available in browser environments"
                            });
                        }
                        return [4 /*yield*/, this.getAuthUri({
                                query: {
                                    prompt: "none",
                                    response_mode: "web_message"
                                }
                            })];
                    case 1:
                        iframeUri = _a.sent();
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 5, , 6]);
                        return [4 /*yield*/, utils_1.authorizeSilently(iframeUri, this.baseUrl, timeout)];
                    case 3:
                        code = _a.sent();
                        fetchTokenUri = document.location.origin + "?code=" + code + "&state=" + encodeURIComponent(this.state || "");
                        return [4 /*yield*/, this.fetchToken(fetchTokenUri)];
                    case 4:
                        token = _a.sent();
                        return [2 /*return*/, token];
                    case 5:
                        error_2 = _a.sent();
                        throw new errors_1.RenewTokenError({
                            message: error_2.message
                        });
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        var verifier = opts.verifier, state = opts.state, oauth2Client = opts.oauth2Client;
        this.baseUrl = baseUrl;
        this.oauth2Client = oauth2Client;
        this.verifier = verifier;
        this.state = state;
    }
    Object.defineProperty(TokenManager.prototype, "token", {
        /**
         * Returns current token used for API requests.
         *
         * @returns  token object which might contain token(s), scope(s), token type and expiration time
         */
        get: function () {
            return this._token;
        },
        enumerable: true,
        configurable: true
    });
    return TokenManager;
}());
exports.TokenManager = TokenManager;
//# sourceMappingURL=tokenManager.js.map