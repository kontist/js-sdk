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
var sinon = require("sinon");
var jsdom_1 = require("jsdom");
var chai_1 = require("chai");
var utils_1 = require("../../lib/utils");
var errors_1 = require("../../lib/errors");
describe("authorizeSilently", function () {
    var addEventListenerSpy;
    var removeEventListenerSpy;
    var assertListeners = function () {
        it("should properly setup and teardown message listeners", function () {
            chai_1.expect(addEventListenerSpy.callCount).to.equal(1);
            chai_1.expect(addEventListenerSpy.getCall(0).args[0]).to.equal("message");
            chai_1.expect(removeEventListenerSpy.callCount).to.equal(1);
            chai_1.expect(removeEventListenerSpy.getCall(0).args[0]).to.equal("message");
        });
    };
    before(function () {
        var jsdom = new jsdom_1.JSDOM("<html><body></body></html>");
        global.window = jsdom.window;
        global.document = window.document;
        addEventListenerSpy = sinon.spy(window, "addEventListener");
        removeEventListenerSpy = sinon.spy(window, "removeEventListener");
    });
    describe("when receiving a message with an authorization code in the response", function () {
        var result;
        var code = "some-random-code";
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addEventListenerSpy.resetHistory();
                        removeEventListenerSpy.resetHistory();
                        setTimeout(function () {
                            window.postMessage({ response: { code: code } }, "*");
                        }, 100);
                        return [4 /*yield*/, utils_1.authorizeSilently("http://some.url", "", 10000)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it("should return the authorization code", function () {
            chai_1.expect(result).to.equal(code);
        });
        assertListeners();
    });
    describe("when receiving an error", function () {
        var error;
        var expectedError = "some-error";
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addEventListenerSpy.resetHistory();
                        removeEventListenerSpy.resetHistory();
                        setTimeout(function () {
                            window.postMessage({ error: expectedError }, "*");
                        }, 100);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, utils_1.authorizeSilently("http://some.url", "", 10000)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        error = err_1;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it("should reject with the returned error", function () {
            chai_1.expect(error).to.equal(expectedError);
        });
        assertListeners();
    });
    describe("when receiving an invalid message", function () {
        var error;
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addEventListenerSpy.resetHistory();
                        removeEventListenerSpy.resetHistory();
                        setTimeout(function () {
                            window.postMessage({ invalid: "response" }, "*");
                        }, 100);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, utils_1.authorizeSilently("http://some.url", "", 10000)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        error = err_2;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it("should throw a RenewTokenError", function () {
            chai_1.expect(error).to.be.an.instanceof(errors_1.RenewTokenError);
            chai_1.expect(error.message).to.equal("Invalid message received from server");
        });
        assertListeners();
    });
    describe("when receiving an empty message", function () {
        var error;
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addEventListenerSpy.resetHistory();
                        removeEventListenerSpy.resetHistory();
                        setTimeout(function () {
                            window.postMessage(null, "*");
                        }, 100);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, utils_1.authorizeSilently("http://some.url", "", 10000)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        error = err_3;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it("should throw a RenewTokenError", function () {
            chai_1.expect(error).to.be.an.instanceof(errors_1.RenewTokenError);
            chai_1.expect(error.message).to.equal("Invalid message received from server");
        });
        assertListeners();
    });
    describe("when the message origin is not the expected one", function () {
        var error;
        before(function () { return __awaiter(void 0, void 0, void 0, function () {
            var err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        addEventListenerSpy.resetHistory();
                        removeEventListenerSpy.resetHistory();
                        setTimeout(function () {
                            window.postMessage({ response: { code: "some-random-code" } }, "*");
                        }, 100);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, utils_1.authorizeSilently("http://some.url", "http://some.wrong.origin", 200)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        error = err_4;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        it("should throw a RenewTokenError", function () {
            chai_1.expect(error).to.be.an.instanceof(errors_1.RenewTokenError);
            chai_1.expect(error.message).to.equal("Server did not respond with authorization code, aborting.");
        });
        assertListeners();
    });
    after(function () {
        global.window = undefined;
        global.document = undefined;
        addEventListenerSpy.restore();
        removeEventListenerSpy.restore();
    });
});
//# sourceMappingURL=authorizeSilently.spec.js.map