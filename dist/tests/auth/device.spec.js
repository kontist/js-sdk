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
var helpers_1 = require("../helpers");
describe("Auth: DeviceBinding", function () {
    describe("#createDevice", function () {
        var createDeviceParams = {
            name: "iPhone XS",
            key: "0402e86575939cd541f016b69b1bc6ee97736f7a6d32c0ad375695ffdc03acf21a3b54224fd164ad6f9cfdfb42b74f49f3d34a41f95d62e893be4977c7ec154f29"
        };
        var createDeviceResponse = {
            deviceId: "daecde61-18a4-4010-a0f7-a8b21c27996a",
            challengeId: "daecde61-18a4-4010-a0f7-a8b21c27996a"
        };
        it("should create device", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, requestStub, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = helpers_1.createClient();
                        requestStub = sinon
                            .stub(client.auth.device["request"], "fetch")
                            .resolves(createDeviceResponse);
                        return [4 /*yield*/, client.auth.device.createDevice(createDeviceParams)];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(requestStub.callCount).to.equal(1);
                        chai_1.expect(requestStub.getCall(0).args).to.eql([
                            "/api/user/devices",
                            "POST",
                            createDeviceParams
                        ]);
                        chai_1.expect(result).to.equal(createDeviceResponse);
                        requestStub.restore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#verifyDevice", function () {
        var deviceId = "daecde61-18a4-4010-a0f7-a8b21c27996a";
        var verifyDeviceParams = {
            challengeId: "daecde61-18a4-4010-a0f7-a8b21c27996a",
            signature: "fake-signature"
        };
        it("should verify device", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, requestStub, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = helpers_1.createClient();
                        requestStub = sinon
                            .stub(client.auth.device["request"], "fetch")
                            .resolves();
                        return [4 /*yield*/, client.auth.device.verifyDevice(deviceId, verifyDeviceParams)];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(requestStub.callCount).to.equal(1);
                        chai_1.expect(requestStub.getCall(0).args).to.eql([
                            "/api/user/devices/" + deviceId + "/verify",
                            "POST",
                            verifyDeviceParams
                        ]);
                        chai_1.expect(result).to.equal(undefined);
                        requestStub.restore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#createDeviceChallenge", function () {
        var deviceId = "daecde61-18a4-4010-a0f7-a8b21c27996a";
        var createDeviceChallengeResponse = {
            id: "83d1a026-dc80-48dc-bc15-4b672716050d",
            stringToSign: "7b6ad39f-1593-4f4d-a84d-b539cc25a3cf"
        };
        it("should create device challenge", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, requestStub, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = helpers_1.createClient();
                        requestStub = sinon
                            .stub(client.auth.device["request"], "fetch")
                            .resolves(createDeviceChallengeResponse);
                        return [4 /*yield*/, client.auth.device.createDeviceChallenge(deviceId)];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(requestStub.callCount).to.equal(1);
                        chai_1.expect(requestStub.getCall(0).args).to.eql([
                            "/api/user/devices/" + deviceId + "/challenges",
                            "POST"
                        ]);
                        chai_1.expect(result).to.equal(createDeviceChallengeResponse);
                        requestStub.restore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe("#verifyDeviceChallenge", function () {
        var deviceId = "daecde61-18a4-4010-a0f7-a8b21c27996a";
        var challengeId = "83d1a026-dc80-48dc-bc15-4b672716050d";
        var verifyDeviceChallengeParams = {
            signature: "fake-signature"
        };
        var verifyDeviceChallengeResponse = {
            token: "fake-confirmed-token"
        };
        it("should verify device challenge", function () { return __awaiter(void 0, void 0, void 0, function () {
            var client, requestStub, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = helpers_1.createClient();
                        requestStub = sinon
                            .stub(client.auth.device["request"], "fetch")
                            .resolves(verifyDeviceChallengeResponse);
                        return [4 /*yield*/, client.auth.device.verifyDeviceChallenge(deviceId, challengeId, verifyDeviceChallengeParams)];
                    case 1:
                        result = _a.sent();
                        chai_1.expect(requestStub.callCount).to.equal(1);
                        chai_1.expect(requestStub.getCall(0).args).to.eql([
                            "/api/user/devices/" + deviceId + "/challenges/" + challengeId + "/verify",
                            "POST",
                            verifyDeviceChallengeParams
                        ]);
                        chai_1.expect(result.accessToken).to.equal(verifyDeviceChallengeResponse.token);
                        chai_1.expect(client.auth.tokenManager.token && client.auth.tokenManager.token.accessToken).to.equal(verifyDeviceChallengeResponse.token);
                        requestStub.restore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=device.spec.js.map