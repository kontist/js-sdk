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
var graphql_request_1 = require("graphql-request");
var subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
var ws = require("ws");
var utils_1 = require("../utils");
var errors_1 = require("../errors");
var GraphQLClient = /** @class */ (function () {
    function GraphQLClient(_a) {
        var _this = this;
        var auth = _a.auth, endpoint = _a.endpoint, subscriptionEndpoint = _a.subscriptionEndpoint;
        this.subscriptions = {};
        this.subscriptionId = 0;
        /**
         * Send a raw GraphQL request and return its response.
         */
        this.rawQuery = function (query, variables) { return __awaiter(_this, void 0, void 0, function () {
            var data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.auth.tokenManager.token) {
                            throw new errors_1.UserUnauthorizedError();
                        }
                        this.client.setHeader("Authorization", "Bearer " + this.auth.tokenManager.token.accessToken);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.client.rawRequest(query, variables)];
                    case 2:
                        data = (_a.sent()).data;
                        return [2 /*return*/, data];
                    case 3:
                        error_1 = _a.sent();
                        throw new errors_1.GraphQLError(utils_1.serializeGraphQLError(error_1));
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        /**
         * Create a subscription client
         */
        this.createSubscriptionClient = function () {
            if (!_this.auth.tokenManager.token) {
                throw new errors_1.UserUnauthorizedError();
            }
            var WebSocket = typeof window === "undefined" ? ws : window.WebSocket;
            return new subscriptions_transport_ws_1.SubscriptionClient(_this.subscriptionEndpoint, {
                lazy: true,
                connectionParams: {
                    Authorization: "Bearer " + _this.auth.tokenManager.token.accessToken
                }
            }, WebSocket);
        };
        /**
         * Handle disconnection:
         *
         * 1. Refresh access token
         * 2. Destroy existing subscription client
         * 3. Resubscribe all previously active subscriptions
         */
        this.handleDisconnection = function () { return __awaiter(_this, void 0, void 0, function () {
            var error_2;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.auth.tokenManager.refresh()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        Object.values(this.subscriptions).forEach(function (_a) {
                            var onError = _a.onError;
                            if (typeof onError === "function") {
                                onError(error_2);
                            }
                        });
                        return [3 /*break*/, 3];
                    case 3:
                        this.subscriptionClient = null;
                        Object.values(this.subscriptions).forEach(function (subscription) {
                            var query = subscription.query, type = subscription.type, onNext = subscription.onNext, onError = subscription.onError, id = subscription.id;
                            _this.subscribe({
                                query: query,
                                type: type,
                                onNext: onNext,
                                onError: onError,
                                subscriptionId: id
                            });
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * Subscribe to a topic and call the respective handler when new data or an error is received
         */
        this.subscribe = function (_a) {
            var query = _a.query, type = _a.type, onError = _a.onError, onNext = _a.onNext, subscriptionId = _a.subscriptionId;
            if (!_this.subscriptionClient) {
                _this.subscriptionClient = _this.createSubscriptionClient();
                _this.subscriptionClient.onDisconnected(_this.handleDisconnection);
            }
            var subscription = _this.subscriptionClient.request({
                query: query
            });
            var unsubscribe = subscription.subscribe({
                next: function (response) {
                    var _a;
                    onNext((_a = response.data) === null || _a === void 0 ? void 0 : _a[type]);
                },
                error: function (error) {
                    if (typeof onError === "function") {
                        onError(error);
                    }
                }
            }).unsubscribe;
            var id = subscriptionId || (_this.subscriptionId += 1);
            _this.subscriptions[id] = {
                id: id,
                query: query,
                type: type,
                onNext: onNext,
                onError: onError,
                unsubscribe: unsubscribe
            };
            return {
                unsubscribe: _this.createUnsubscriber(id)
            };
        };
        /**
         * Create an unsubscribe function to be called by the subscriber
         */
        this.createUnsubscriber = function (subscriptionId) { return function () {
            var _a, _b;
            (_a = _this.subscriptions[subscriptionId]) === null || _a === void 0 ? void 0 : _a.unsubscribe();
            delete _this.subscriptions[subscriptionId];
            if (Object.keys(_this.subscriptions).length === 0) {
                (_b = _this.subscriptionClient) === null || _b === void 0 ? void 0 : _b.close();
                _this.subscriptionClient = null;
            }
        }; };
        this.auth = auth;
        this.client = new graphql_request_1.GraphQLClient(endpoint);
        this.subscriptionEndpoint = subscriptionEndpoint;
    }
    return GraphQLClient;
}());
exports.GraphQLClient = GraphQLClient;
//# sourceMappingURL=client.js.map