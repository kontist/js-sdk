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
var graphql_request_1 = require("graphql-request");
var subscriptions = require("subscriptions-transport-ws");
var ws = require("ws");
var types_1 = require("../../lib/graphql/types");
var errors_1 = require("../../lib/errors");
var helpers_1 = require("../helpers");
var constants_1 = require("../../lib/constants");
describe("rawQuery", function () {
    describe("Error handling", function () {
        var setup = function (response) { return __awaiter(void 0, void 0, void 0, function () {
            var stub, client, error, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        stub = sinon.stub(graphql_request_1.GraphQLClient.prototype, "rawRequest").throws(function () {
                            var error = new Error();
                            error.response = response;
                            return error;
                        });
                        client = helpers_1.createClient();
                        client.auth.tokenManager.setToken("dummy-access-token");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, client.graphQL.rawQuery("")];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        error = err_1;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, {
                            error: error,
                            stub: stub
                        }];
                }
            });
        }); };
        describe("when a standard API error is returned", function () {
            it("should throw a GraphQLError with proper message, status and type", function () { return __awaiter(void 0, void 0, void 0, function () {
                var message, status, type, response, _a, error, stub;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            message = "Some specific error message";
                            status = 400;
                            type = "http://www.iana.org/assignments/http-status-codes#400";
                            response = {
                                errors: [
                                    {
                                        message: message,
                                        locations: [{ line: 1, column: 42 }],
                                        extensions: {
                                            status: status,
                                            type: type
                                        }
                                    }
                                ]
                            };
                            return [4 /*yield*/, setup(response)];
                        case 1:
                            _a = _b.sent(), error = _a.error, stub = _a.stub;
                            chai_1.expect(error).to.be.an.instanceof(errors_1.GraphQLError);
                            chai_1.expect(error.message).to.equal(message);
                            chai_1.expect(error.status).to.equal(status);
                            chai_1.expect(error.type).to.equal(type);
                            stub.restore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("when an unexpected error is returned", function () {
            it("should throw a GraphQLError with proper message", function () { return __awaiter(void 0, void 0, void 0, function () {
                var message, response, _a, error, stub;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            message = "Generic error message";
                            response = {
                                errors: [
                                    {
                                        message: message,
                                        locations: [{ line: 1, column: 42 }]
                                    }
                                ]
                            };
                            return [4 /*yield*/, setup(response)];
                        case 1:
                            _a = _b.sent(), error = _a.error, stub = _a.stub;
                            chai_1.expect(error).to.be.an.instanceof(errors_1.GraphQLError);
                            chai_1.expect(error.message).to.equal(message);
                            chai_1.expect(error.status).to.be.undefined;
                            chai_1.expect(error.type).to.be.undefined;
                            stub.restore();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
describe("subscribe", function () {
    var observableMock = {
        nextHandlers: [],
        errorHandlers: [],
        triggerNext: function (response) {
            this.nextHandlers.forEach(function (handler) {
                handler(response);
            });
        },
        triggerError: function (err) {
            this.errorHandlers.forEach(function (handler) {
                handler(err);
            });
        }
    };
    var subscribeStub = sinon
        .stub()
        .callsFake(function (_a) {
        var next = _a.next, error = _a.error;
        observableMock.nextHandlers.push(next);
        observableMock.errorHandlers.push(error);
        return {
            unsubscribe: function () {
                observableMock.nextHandlers = observableMock.nextHandlers.filter(function (handler) { return handler !== next; });
                observableMock.errorHandlers = observableMock.errorHandlers.filter(function (handler) { return handler !== error; });
            }
        };
    });
    var subscriptionClientMock = {
        onDisconnected: sinon.spy(),
        close: sinon.spy(),
        request: function () { return ({
            subscribe: subscribeStub
        }); }
    };
    var subscriptionQuery = "subscription someSubscription {}";
    var client = helpers_1.createClient();
    var firstSubscriptionOnNextStub = sinon.stub();
    var secondSubscriptionOnNextStub = sinon.stub();
    var firstSubscriptionOnErrorStub = sinon.stub();
    var secondSubscriptionOnErrorStub = sinon.stub();
    var createSubscriptionClientStub;
    var firstSubscriptionUnsubscriber;
    var secondSubscriptionUnsubscriber;
    before(function () {
        createSubscriptionClientStub = sinon
            .stub(client.graphQL, "createSubscriptionClient")
            .returns(subscriptionClientMock);
    });
    after(function () {
        createSubscriptionClientStub.restore();
    });
    describe("when adding the first subscription", function () {
        before(function () {
            var unsubscribe = client.graphQL.subscribe({
                query: subscriptionQuery,
                type: types_1.SubscriptionType.newTransaction,
                onNext: firstSubscriptionOnNextStub,
                onError: firstSubscriptionOnErrorStub
            }).unsubscribe;
            firstSubscriptionUnsubscriber = unsubscribe;
        });
        it("should create a subscription client", function () {
            chai_1.expect(createSubscriptionClientStub.callCount).to.equal(1);
        });
        it("should setup a disconnection handler", function () {
            chai_1.expect(subscriptionClientMock.onDisconnected.callCount).to.equal(1);
            chai_1.expect(subscriptionClientMock.onDisconnected.getCall(0).args[0]).to.equal(client.graphQL["handleDisconnection"]);
        });
        it("should add a subscription to its state", function () {
            var subscription = client.graphQL["subscriptions"][1];
            chai_1.expect(subscription.id).to.equal(1);
            chai_1.expect(subscription.query).to.equal(subscriptionQuery);
            chai_1.expect(subscription.type).to.equal(types_1.SubscriptionType.newTransaction);
            chai_1.expect(subscription.onNext).to.equal(firstSubscriptionOnNextStub);
            chai_1.expect(subscription.onError).to.equal(firstSubscriptionOnErrorStub);
            chai_1.expect(subscription.unsubscribe).to.be.a("function");
        });
    });
    describe("when adding a second subscription", function () {
        before(function () {
            createSubscriptionClientStub.resetHistory();
            var unsubscribe = client.graphQL.subscribe({
                query: subscriptionQuery,
                type: types_1.SubscriptionType.newTransaction,
                onNext: secondSubscriptionOnNextStub,
                onError: secondSubscriptionOnErrorStub
            }).unsubscribe;
            secondSubscriptionUnsubscriber = unsubscribe;
        });
        it("should NOT create a subscription client", function () {
            chai_1.expect(createSubscriptionClientStub.callCount).to.equal(0);
        });
        it("should add a second subscription to its state", function () {
            var subscription = client.graphQL["subscriptions"][2];
            chai_1.expect(Object.keys(client.graphQL["subscriptions"]).length).to.equal(2);
            chai_1.expect(subscription.id).to.equal(2);
            chai_1.expect(subscription.query).to.equal(subscriptionQuery);
            chai_1.expect(subscription.type).to.equal(types_1.SubscriptionType.newTransaction);
            chai_1.expect(subscription.onNext).to.equal(secondSubscriptionOnNextStub);
            chai_1.expect(subscription.onError).to.equal(secondSubscriptionOnErrorStub);
            chai_1.expect(subscription.unsubscribe).to.be.a("function");
        });
    });
    describe("when receiving new data", function () {
        it("should call the subscribed onNext handlers", function () {
            var _a;
            chai_1.expect(firstSubscriptionOnNextStub.callCount).to.equal(0);
            chai_1.expect(secondSubscriptionOnNextStub.callCount).to.equal(0);
            var dummyData = {
                data: (_a = {}, _a[types_1.SubscriptionType.newTransaction] = "some-data", _a)
            };
            observableMock.triggerNext(dummyData);
            chai_1.expect(firstSubscriptionOnNextStub.callCount).to.equal(1);
            var data = firstSubscriptionOnNextStub.getCall(0).args[0];
            chai_1.expect(data).to.equal("some-data");
            chai_1.expect(secondSubscriptionOnNextStub.callCount).to.equal(1);
            var secondOnNextData = secondSubscriptionOnNextStub.getCall(0).args[0];
            chai_1.expect(secondOnNextData).to.equal("some-data");
            chai_1.expect(firstSubscriptionOnErrorStub.callCount).to.equal(0);
            chai_1.expect(secondSubscriptionOnErrorStub.callCount).to.equal(0);
        });
    });
    describe("when receiving an error", function () {
        it("should call the subscribed onError handlers", function () {
            var dummyError = new Error("Unauthorized");
            observableMock.triggerError(dummyError);
            chai_1.expect(firstSubscriptionOnErrorStub.callCount).to.equal(1);
            chai_1.expect(secondSubscriptionOnErrorStub.callCount).to.equal(1);
            var error = firstSubscriptionOnErrorStub.getCall(0).args[0];
            chai_1.expect(error).to.equal(dummyError);
            var secondError = secondSubscriptionOnErrorStub.getCall(0).args[0];
            chai_1.expect(secondError).to.equal(dummyError);
            chai_1.expect(firstSubscriptionOnNextStub.callCount).to.equal(1);
            chai_1.expect(secondSubscriptionOnNextStub.callCount).to.equal(1);
        });
    });
    describe("when unsubscribing", function () {
        before(function () {
            firstSubscriptionUnsubscriber();
        });
        it("should no longer call the unsubscribed handlers", function () {
            observableMock.triggerNext({ data: { some: "data" } });
            chai_1.expect(firstSubscriptionOnNextStub.callCount).to.equal(1);
            chai_1.expect(secondSubscriptionOnNextStub.callCount).to.equal(2);
            observableMock.triggerError(new Error());
            chai_1.expect(firstSubscriptionOnErrorStub.callCount).to.equal(1);
            chai_1.expect(secondSubscriptionOnErrorStub.callCount).to.equal(2);
        });
        it("should remove the corresponding subscription from its state", function () {
            var subscriptions = client.graphQL["subscriptions"];
            chai_1.expect(Object.keys(subscriptions).length).to.equal(1);
            chai_1.expect(subscriptions[1]).to.be.a("undefined");
            chai_1.expect(subscriptions[2]).to.exist;
        });
    });
    describe("when the last subscription is unsubscribed", function () {
        it("should close the websocket and remove the subscription client", function () {
            chai_1.expect(subscriptionClientMock.close.callCount).to.equal(0);
            secondSubscriptionUnsubscriber();
            chai_1.expect(Object.keys(client.graphQL["subscriptions"]).length).to.equal(0);
            chai_1.expect(subscriptionClientMock.close.callCount).to.equal(1);
            chai_1.expect(client.graphQL["subscriptionClient"]).to.be.a("null");
            observableMock.triggerNext({ data: { some: "data" } });
            observableMock.triggerError(new Error());
            chai_1.expect(firstSubscriptionOnNextStub.callCount).to.equal(1);
            chai_1.expect(secondSubscriptionOnNextStub.callCount).to.equal(2);
            chai_1.expect(firstSubscriptionOnErrorStub.callCount).to.equal(1);
            chai_1.expect(secondSubscriptionOnErrorStub.callCount).to.equal(2);
        });
    });
});
describe("createUnsubscriber", function () {
    var client;
    var firstUnsubscribeStub;
    var secondUnsubscribeStub;
    var closeStub;
    before(function () {
        firstUnsubscribeStub = sinon.stub();
        secondUnsubscribeStub = sinon.stub();
        closeStub = sinon.stub();
        client = helpers_1.createClient();
        client.graphQL.subscriptionClient = { close: closeStub };
        client.graphQL.subscriptions = {
            1: {
                unsubscribe: firstUnsubscribeStub
            },
            42: {
                unsubscribe: secondUnsubscribeStub
            }
        };
    });
    describe("when some subscriptions remain after unsubscribing", function () {
        before(function () {
            client.graphQL.createUnsubscriber(1)();
        });
        it("should call unsubscribe on the corresponding subscription and remove it from state", function () {
            chai_1.expect(firstUnsubscribeStub.callCount).to.equal(1);
            chai_1.expect(Object.keys(client.graphQL.subscriptions)).to.deep.equal(["42"]);
        });
        it("should not close the subscription connection nor destroy the subscription client", function () {
            chai_1.expect(closeStub.callCount).to.equal(0);
            chai_1.expect(client.graphQL.subscriptionClient).to.not.be.a("null");
        });
    });
    describe("when the subscriptionId does not exist", function () {
        before(function () {
            client.graphQL.createUnsubscriber(12344)();
        });
        it("should not remove any subscription", function () {
            chai_1.expect(Object.keys(client.graphQL.subscriptions)).to.deep.equal(["42"]);
        });
        it("should not close the subscription connection nor destroy the subscription client", function () {
            chai_1.expect(closeStub.callCount).to.equal(0);
            chai_1.expect(client.graphQL.subscriptionClient).to.not.be.a("null");
        });
    });
    describe("when unsubscribing the last subscription", function () {
        before(function () {
            client.graphQL.createUnsubscriber(42)();
        });
        it("should call unsubscribe on the corresponding subscription and remove it from state", function () {
            chai_1.expect(secondUnsubscribeStub.callCount).to.equal(1);
            chai_1.expect(client.graphQL.subscriptions).to.deep.equal({});
        });
        it("should close the subscription connection and destroy the subscription client", function () {
            chai_1.expect(closeStub.callCount).to.equal(1);
            chai_1.expect(client.graphQL.subscriptionClient).to.be.a("null");
        });
    });
    describe("when the subscription client does not exist and unsubscribing the last subscription", function () {
        before(function () {
            client.graphQL.subscriptionClient = undefined;
            client.graphQL.subscriptions = {
                42: {
                    unsubscribe: function () { }
                }
            };
        });
        it("should not throw any error", function () {
            client.graphQL.createUnsubscriber(42)();
        });
    });
});
describe("handleDisconnection", function () {
    var client;
    var refreshTokenStub;
    var subscribeStub;
    var firstSubscription;
    var secondSubscription;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = helpers_1.createClient();
                    refreshTokenStub = sinon.stub(client.auth.tokenManager, "refresh");
                    subscribeStub = sinon.stub(client.graphQL, "subscribe");
                    client.graphQL.subscriptionClient = "dummy-subscription-client";
                    firstSubscription = {
                        id: 1,
                        query: "query #1",
                        type: types_1.SubscriptionType.newTransaction,
                        onNext: function () { },
                        onError: sinon.stub()
                    };
                    secondSubscription = {
                        id: 1,
                        query: "query #1",
                        type: types_1.SubscriptionType.newTransaction,
                        onNext: function () { }
                    };
                    client.graphQL.subscriptions = {
                        1: firstSubscription,
                        2: secondSubscription
                    };
                    return [4 /*yield*/, client.graphQL.handleDisconnection()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    after(function () {
        refreshTokenStub.restore();
        subscribeStub.restore();
    });
    it("should refresh auth token", function () {
        chai_1.expect(refreshTokenStub.callCount).to.equal(1);
    });
    it("should destroy the existing subscriptionClient", function () {
        chai_1.expect(client.graphQL.subscriptionClient).to.be.a("null");
    });
    it("should call subscribe for each existing subscription", function () {
        chai_1.expect(subscribeStub.callCount).to.equal(2);
        var _a = subscribeStub.getCall(0).args[0], firstQuery = _a.query, firstType = _a.type, firstHandler = _a.onNext, firstSubscriptionId = _a.subscriptionId;
        chai_1.expect(firstQuery).to.equal(firstSubscription.query);
        chai_1.expect(firstType).to.equal(firstSubscription.type);
        chai_1.expect(firstHandler).to.equal(firstSubscription.onNext);
        chai_1.expect(firstSubscriptionId).to.equal(firstSubscription.id);
        var _b = subscribeStub.getCall(1).args[0], secondQuery = _b.query, secondType = _b.type, secondHandler = _b.onNext, secondSubscriptionId = _b.subscriptionId;
        chai_1.expect(secondQuery).to.equal(secondSubscription.query);
        chai_1.expect(secondType).to.equal(secondSubscription.type);
        chai_1.expect(secondHandler).to.equal(secondSubscription.onNext);
        chai_1.expect(secondSubscriptionId).to.equal(secondSubscription.id);
    });
    describe("when auth token refresh fails", function () {
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refreshTokenStub.throws(new Error("some error"));
                        return [4 /*yield*/, client.graphQL.handleDisconnection()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should call every subscribed onError handler", function () {
            chai_1.expect(firstSubscription.onError.callCount).to.equal(1);
            var firstSubscriptionError = firstSubscription.onError.getCall(0)
                .args[0];
            chai_1.expect(firstSubscriptionError.message).to.equal("some error");
        });
    });
});
describe("createSubscriptionClient", function () {
    var client;
    var subscriptionClientStub;
    var fakeSubscriptionClient;
    before(function () {
        client = helpers_1.createClient();
        fakeSubscriptionClient = {
            fake: "client"
        };
        subscriptionClientStub = sinon
            .stub(subscriptions, "SubscriptionClient")
            .returns(fakeSubscriptionClient);
    });
    after(function () {
        subscriptionClientStub.restore();
    });
    describe("when auth token is missing", function () {
        it("should throw a UserUnauthorized error", function () {
            var error;
            try {
                client.graphQL.createSubscriptionClient();
            }
            catch (err) {
                error = err;
            }
            chai_1.expect(error).to.be.instanceof(errors_1.UserUnauthorizedError);
        });
    });
    describe("when auth token is present", function () {
        before(function () {
            client.auth.tokenManager.setToken("dummy-token");
        });
        it("should create a new SubscriptionClient and return it", function () {
            var subscriptionClient = client.graphQL.createSubscriptionClient();
            chai_1.expect(subscriptionClientStub.callCount).to.equal(1);
            var _a = subscriptionClientStub.getCall(0).args, endpoint = _a[0], options = _a[1], websocket = _a[2];
            chai_1.expect(endpoint).to.equal(constants_1.KONTIST_SUBSCRIPTION_API_BASE_URL + "/api/graphql");
            chai_1.expect(options.lazy).to.equal(true);
            chai_1.expect(options.connectionParams).to.deep.equal({
                Authorization: "Bearer dummy-token"
            });
            chai_1.expect(websocket).to.equal(ws);
            chai_1.expect(subscriptionClient).to.equal(fakeSubscriptionClient);
        });
        describe("when executing in a browser environment", function () {
            before(function () {
                global.window = {
                    WebSocket: { fake: "websocket" }
                };
            });
            after(function () {
                global.window = undefined;
            });
            it("should use the native browser WebSocket implementation", function () {
                subscriptionClientStub.resetHistory();
                client.graphQL.createSubscriptionClient();
                chai_1.expect(subscriptionClientStub.callCount).to.equal(1);
                chai_1.expect(subscriptionClientStub.getCall(0).args[2].fake).to.equal("websocket");
            });
        });
    });
});
//# sourceMappingURL=client.spec.js.map