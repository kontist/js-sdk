"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon = require("sinon");
var helpers_1 = require("../helpers");
describe("Auth", function () {
    var verifier = "Huag6ykQU7SaEYKtmNUeM8txt4HzEIfG";
    var clientSecret = "very-secret";
    var sandbox;
    beforeEach(function () {
        sandbox = sinon.createSandbox();
    });
    afterEach(function () {
        sandbox.restore();
    });
    describe('#constructor', function () {
        describe("when both code verifier and code secret are provided", function () {
            it("should throw an error", function () {
                var error;
                try {
                    helpers_1.createClient({ verifier: verifier, clientSecret: clientSecret });
                }
                catch (err) {
                    error = err;
                }
                chai_1.expect(error.message).to.equal("You can provide only one parameter from ['verifier', 'clientSecret'].");
            });
        });
        describe("when code verifier is provided but state or redirectUri are missing", function () {
            var assertMissingOptionError = function (option) {
                var _a;
                var error;
                try {
                    helpers_1.createClient((_a = { verifier: verifier }, _a[option] = undefined, _a));
                }
                catch (err) {
                    error = err;
                }
                chai_1.expect(error.message).to.equal("If you are providing a 'verifier', you must also provide 'state' and 'redirectUri' options.");
            };
            it("should throw an error", function () {
                assertMissingOptionError("state");
                assertMissingOptionError("redirectUri");
            });
        });
    });
    describe('#getAuthUri', function () {
        it('should show deprecation notice and call correct method', function () {
            // arrange
            var client = helpers_1.createClient({ clientSecret: clientSecret });
            var spyOnShowDeprecationWarning = sandbox.stub(client.auth, "showDeprecationWarning");
            var spyOnGetAuthUri = sandbox.stub(client.auth.tokenManager, "getAuthUri");
            var opts = { query: { test: "123" } };
            // act
            client.auth.getAuthUri(opts);
            // assert
            sinon.assert.calledWith(spyOnShowDeprecationWarning, "getAuthUri");
            sinon.assert.calledWith(spyOnGetAuthUri, opts);
        });
    });
    describe('#fetchToken', function () {
        it('should show deprecation notice and call correct method', function () {
            // arrange
            var client = helpers_1.createClient({ clientSecret: clientSecret });
            var spyOnShowDeprecationWarning = sandbox.stub(client.auth, "showDeprecationWarning");
            var spyOnFetchToken = sandbox.stub(client.auth.tokenManager, "fetchToken");
            var callbackUri = "http://example.com";
            // act
            client.auth.fetchToken(callbackUri);
            // assert
            sinon.assert.calledWith(spyOnShowDeprecationWarning, "fetchToken");
            sinon.assert.calledWith(spyOnFetchToken, callbackUri);
        });
    });
    describe('#fetchTokenFromCredentials', function () {
        it('should show deprecation notice and call correct method', function () {
            // arrange
            var client = helpers_1.createClient({ clientSecret: clientSecret });
            var spyOnShowDeprecationWarning = sandbox.stub(client.auth, "showDeprecationWarning");
            var spyOnFetchTokenFromCredentials = sandbox.stub(client.auth.tokenManager, "fetchTokenFromCredentials");
            var opts = { username: "test", password: "test2" };
            // act
            client.auth.fetchTokenFromCredentials(opts);
            // assert
            sinon.assert.calledWith(spyOnShowDeprecationWarning, "fetchTokenFromCredentials");
            sinon.assert.calledWith(spyOnFetchTokenFromCredentials, opts);
        });
    });
    describe('#refresh', function () {
        it('should show deprecation notice and call correct method', function () {
            // arrange
            var client = helpers_1.createClient({ clientSecret: clientSecret });
            var spyOnShowDeprecationWarning = sandbox.stub(client.auth, "showDeprecationWarning");
            var spyOnRefresh = sandbox.stub(client.auth.tokenManager, "refresh");
            var timeout = 1234;
            // act
            client.auth.refresh(timeout);
            // assert
            sinon.assert.calledWith(spyOnShowDeprecationWarning, "refresh");
            sinon.assert.calledWith(spyOnRefresh, timeout);
        });
    });
    describe('#setToken', function () {
        it('should show deprecation notice and call correct method', function () {
            // arrange
            var client = helpers_1.createClient({ clientSecret: clientSecret });
            var spyOnShowDeprecationWarning = sandbox.stub(client.auth, "showDeprecationWarning");
            var spyOnSetToken = sandbox.stub(client.auth.tokenManager, "setToken");
            var accessToken = "at";
            var refreshToken = "rf";
            var tokenType = "tt";
            // act
            client.auth.setToken(accessToken, refreshToken, tokenType);
            // assert
            sinon.assert.calledWith(spyOnShowDeprecationWarning, "setToken");
            sinon.assert.calledWith(spyOnSetToken, accessToken, refreshToken, tokenType);
        });
    });
    describe('#token', function () {
        it('should show deprecation notice and call correct method', function () {
            // arrange
            var client = helpers_1.createClient({ clientSecret: clientSecret });
            var spyOnShowDeprecationWarning = sandbox.stub(client.auth, "showDeprecationWarning");
            var spyOnToken = sandbox.spy();
            sandbox.stub(client.auth.tokenManager, "token").get(spyOnToken);
            // act
            var _ = client.auth.token;
            // assert
            sinon.assert.calledWith(spyOnShowDeprecationWarning, "token");
            sinon.assert.called(spyOnToken);
        });
    });
});
//# sourceMappingURL=auth.spec.js.map