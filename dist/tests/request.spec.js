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
require("cross-fetch/polyfill");
var tokenManager_1 = require("../lib/auth/tokenManager");
var request_1 = require("../lib/request");
var types_1 = require("../lib/types");
var errors_1 = require("../lib/errors");
describe("HttpRequest", function () {
    var sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });
    afterEach(function () {
        sandbox.restore();
    });
    describe("#fetch", function () {
        it("should fail if tokenManager has no token", function () { return __awaiter(void 0, void 0, void 0, function () {
            var baseUrl, tm, request, error, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseUrl = "http://localhost:3000";
                        tm = new tokenManager_1.TokenManager(baseUrl, { oauth2Client: {} });
                        request = new request_1.HttpRequest(baseUrl, tm);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, request.fetch("", types_1.HttpMethod.POST)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        error = e_1;
                        return [3 /*break*/, 4];
                    case 4:
                        // assert
                        chai_1.expect(error).to.be.an.instanceOf(errors_1.UserUnauthorizedError);
                        return [2 /*return*/];
                }
            });
        }); });
        it("should fail if response is not ok", function () { return __awaiter(void 0, void 0, void 0, function () {
            var baseUrl, tm, request, error, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseUrl = "http://localhost:3000";
                        tm = {
                            token: { accessToken: "eyMockToken" }
                        };
                        request = new request_1.HttpRequest(baseUrl, tm);
                        sandbox.stub(global, "fetch").resolves({
                            ok: false,
                            status: 123,
                            statusText: "mock",
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, request.fetch("", types_1.HttpMethod.POST)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        error = e_2;
                        return [3 /*break*/, 4];
                    case 4:
                        // assert
                        chai_1.expect(error).to.be.an.instanceOf(errors_1.KontistSDKError);
                        chai_1.expect(error.status).to.eq(123);
                        chai_1.expect(error.message).to.eq("mock");
                        return [2 /*return*/];
                }
            });
        }); });
        it("should return undefined if status is 204", function () { return __awaiter(void 0, void 0, void 0, function () {
            var baseUrl, tm, request, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseUrl = "http://localhost:3000";
                        tm = {
                            token: { accessToken: "eyMockToken" }
                        };
                        request = new request_1.HttpRequest(baseUrl, tm);
                        sandbox.stub(global, "fetch").resolves({
                            ok: true,
                            status: 204,
                        });
                        return [4 /*yield*/, request.fetch("", types_1.HttpMethod.POST)];
                    case 1:
                        result = _a.sent();
                        // assert
                        chai_1.expect(result).to.be.undefined;
                        return [2 /*return*/];
                }
            });
        }); });
        it("should call fetch with correct parameters", function () { return __awaiter(void 0, void 0, void 0, function () {
            var baseUrl, tm, request, stubOnFetch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseUrl = "http://localhost:3000";
                        tm = {
                            token: { accessToken: "eyMockToken" }
                        };
                        request = new request_1.HttpRequest(baseUrl, tm);
                        stubOnFetch = sandbox.stub(global, "fetch").resolves({
                            ok: true,
                            status: 204,
                        });
                        // act
                        return [4 /*yield*/, request.fetch("/path", types_1.HttpMethod.POST, { test: 123 })];
                    case 1:
                        // act
                        _a.sent();
                        // assert
                        sinon.assert.calledWith(stubOnFetch, "http://localhost:3000/path", {
                            method: "POST",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/json",
                                Authorization: "Bearer eyMockToken"
                            },
                            body: '{"test":123}'
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        it("should return object of json response", function () { return __awaiter(void 0, void 0, void 0, function () {
            var baseUrl, tm, request, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        baseUrl = "http://localhost:3000";
                        tm = {
                            token: { accessToken: "eyMockToken" }
                        };
                        request = new request_1.HttpRequest(baseUrl, tm);
                        sandbox.stub(global, "fetch").resolves({
                            ok: true,
                            json: function () { return Promise.resolve({ test: 123 }); }
                        });
                        return [4 /*yield*/, request.fetch("", types_1.HttpMethod.POST)];
                    case 1:
                        result = _a.sent();
                        // assert
                        chai_1.expect(result).to.be.eql({ test: 123 });
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=request.spec.js.map