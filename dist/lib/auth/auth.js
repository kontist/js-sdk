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
var ClientOAuth2 = require("client-oauth2");
var tokenManager_1 = require("./tokenManager");
var push_1 = require("./push");
var device_1 = require("./device");
var request_1 = require("../request");
var errors_1 = require("../errors");
var Auth = /** @class */ (function () {
    /**
     * @param baseUrl  Kontist API base url
     * @param opts     OAuth2 client data including at least clientId, redirectUri,
     *                 scopes, state and clientSecret or code verifier (for PKCE).
     * @throws         when both clientSecret and code verifier are provided
     * @throws         when verifier is provided but state or redirectUri are missing
     */
    function Auth(baseUrl, opts) {
        var _this = this;
        this.showDeprecationWarning = function (methodName) {
            if (process.env.NODE_ENV !== 'production') {
                var message = "The 'auth." + methodName + "' method is deprecated and will be removed in v1.0.0. Please consider using 'auth.tokenManager." + methodName + "' instead.";
                console.warn(message);
            }
        };
        /**
         * @deprecated This method will be removed in v1.0.0.
         *             Use `auth.tokenManager.getAuthUri` method directly instead.
         *
         * Build a uri to which the user must be redirected for login.
         */
        this.getAuthUri = function (opts) {
            if (opts === void 0) { opts = {}; }
            return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this.showDeprecationWarning("getAuthUri");
                    return [2 /*return*/, this.tokenManager.getAuthUri(opts)];
                });
            });
        };
        /**
         * @deprecated This method will be removed in v1.0.0.
         *             Use `auth.tokenManager.fetchToken` method directly instead.
         *
         * This method must be called during the callback via `redirectUri`.
         *
         * @param callbackUri  `redirectUri` containing OAuth2 data after user authentication
         * @returns            token object which might contain token(s), scope(s), token type and expiration time
         */
        this.fetchToken = function (callbackUri) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.showDeprecationWarning("fetchToken");
                return [2 /*return*/, this.tokenManager.fetchToken(callbackUri)];
            });
        }); };
        /**
         * @deprecated This method will be removed in v1.0.0.
         *             Use `auth.tokenManager.fetchTokenFromCredentials` method directly instead.
         *
         * Fetches token from owner credentials.
         * Only works for client IDs that support the 'password' grant type
         *
         * @param opts  Username, password, and an optional set of scopes
         *              When given a set of scopes, they override the default list of
         *              scopes of `this` intance
         *
         * @returns     token object which might contain token(s), scope(s), token type and expiration time
         */
        this.fetchTokenFromCredentials = function (opts) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.showDeprecationWarning("fetchTokenFromCredentials");
                return [2 /*return*/, this.tokenManager.fetchTokenFromCredentials(opts)];
            });
        }); };
        /**
         * @deprecated This method will be removed in v1.0.0.
         *             Use `auth.tokenManager.refresh` method directly instead.
         *
         * Refresh auth token silently for browser environments
         * Renew auth token
         *
         * @param timeout  optional timeout for renewal in ms
         */
        this.refresh = function (timeout) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.showDeprecationWarning("refresh");
                return [2 /*return*/, this.tokenManager.refresh(timeout)];
            });
        }); };
        /**
         * @deprecated This method will be removed in v1.0.0.
         *             Use `auth.tokenManager.setToken` method directly instead.
         *
         * Sets up previously created token for all upcoming requests.
         *
         * @param accessToken   access token
         * @param refreshToken  optional refresh token
         * @param tokenType     token type
         * @returns             token object which might contain token(s), scope(s), token type and expiration time
         */
        this.setToken = function (accessToken, refreshToken, tokenType) {
            _this.showDeprecationWarning("setToken");
            return _this.tokenManager.setToken(accessToken, refreshToken, tokenType);
        };
        var clientId = opts.clientId, clientSecret = opts.clientSecret, oauthClient = opts.oauthClient, redirectUri = opts.redirectUri, scopes = opts.scopes, state = opts.state, verifier = opts.verifier;
        if (verifier && clientSecret) {
            throw new errors_1.KontistSDKError({
                message: "You can provide only one parameter from ['verifier', 'clientSecret']."
            });
        }
        if (verifier && (!state || !redirectUri)) {
            throw new errors_1.KontistSDKError({
                message: "If you are providing a 'verifier', you must also provide 'state' and 'redirectUri' options."
            });
        }
        var oauth2Client = oauthClient ||
            new ClientOAuth2({
                accessTokenUri: baseUrl + "/api/oauth/token",
                authorizationUri: baseUrl + "/api/oauth/authorize",
                clientId: clientId,
                clientSecret: clientSecret,
                redirectUri: redirectUri,
                scopes: scopes,
                state: state
            });
        this.tokenManager = new tokenManager_1.TokenManager(baseUrl, {
            state: state,
            verifier: verifier,
            oauth2Client: oauth2Client
        });
        var request = new request_1.HttpRequest(baseUrl, this.tokenManager);
        this.device = new device_1.DeviceBinding(this.tokenManager, request);
        this.push = new push_1.PushNotificationMFA(this.tokenManager, request);
    }
    Object.defineProperty(Auth.prototype, "token", {
        /**
         * @deprecated This method will be removed in v1.0.0.
         *             Use `auth.tokenManager.token` getter directly instead.
         *
         * Returns current token used for API requests.
         *
         * @returns  token object which might contain token(s), scope(s), token type and expiration time
         */
        get: function () {
            this.showDeprecationWarning("token");
            return this.tokenManager.token;
        },
        enumerable: true,
        configurable: true
    });
    return Auth;
}());
exports.Auth = Auth;
//# sourceMappingURL=auth.js.map