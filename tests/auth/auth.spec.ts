import { expect } from "chai";
import * as sinon from "sinon";
import { ClientOpts } from "../../lib/types";

import { createClient } from "../helpers";

describe("Auth", () => {
  const verifier = "Huag6ykQU7SaEYKtmNUeM8txt4HzEIfG";
  const clientSecret = "very-secret";
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("#constructor", () => {
    describe("when both code verifier and code secret are provided", () => {
      it("should throw an error", () => {
        let error;
        try {
          createClient({ verifier, clientSecret });
        } catch (err) {
          error = err;
        }

        expect(error.message).to.equal(
          "You can provide only one parameter from ['verifier', 'clientSecret'].",
        );
      });
    });

    describe("when code verifier is provided but state or redirectUri are missing", () => {
      const assertMissingOptionError = (option: keyof ClientOpts) => {
        let error;
        try {
          createClient({ verifier, [option]: undefined });
        } catch (err) {
          error = err;
        }

        expect(error.message).to.equal(
          "If you are providing a 'verifier', you must also provide 'state' and 'redirectUri' options.",
        );
      };

      it("should throw an error", () => {
        assertMissingOptionError("state");
        assertMissingOptionError("redirectUri");
      });
    });
  });

  describe("#getAuthUri", () => {
    it("should show deprecation notice and call correct method", () => {
      // arrange
      const client = createClient({ clientSecret });
      const spyOnShowDeprecationWarning = sandbox.stub(client.auth as any, "showDeprecationWarning");
      const spyOnGetAuthUri = sandbox.stub(client.auth.tokenManager, "getAuthUri");
      const opts = { query: { test: "123" } };

      // act
      client.auth.getAuthUri(opts);

      // assert
      sinon.assert.calledWith(spyOnShowDeprecationWarning, "getAuthUri");
      sinon.assert.calledWith(spyOnGetAuthUri, opts);
    });
  });

  describe("#fetchToken", () => {
    it("should show deprecation notice and call correct method", () => {
      // arrange
      const client = createClient({ clientSecret });
      const spyOnShowDeprecationWarning = sandbox.stub(client.auth as any, "showDeprecationWarning");
      const spyOnFetchToken = sandbox.stub(client.auth.tokenManager, "fetchToken");
      const callbackUri = "http://example.com";

      // act
      client.auth.fetchToken(callbackUri);

      // assert
      sinon.assert.calledWith(spyOnShowDeprecationWarning, "fetchToken");
      sinon.assert.calledWith(spyOnFetchToken, callbackUri);
    });
  });

  describe("#fetchTokenFromCredentials", () => {
    it("should show deprecation notice and call correct method", () => {
      // arrange
      const client = createClient({ clientSecret });
      const spyOnShowDeprecationWarning = sandbox.stub(client.auth as any, "showDeprecationWarning");
      const spyOnFetchTokenFromCredentials = sandbox.stub(client.auth.tokenManager, "fetchTokenFromCredentials");
      const opts = { username: "test", password: "test2" };

      // act
      client.auth.fetchTokenFromCredentials(opts);

      // assert
      sinon.assert.calledWith(spyOnShowDeprecationWarning, "fetchTokenFromCredentials");
      sinon.assert.calledWith(spyOnFetchTokenFromCredentials, opts);
    });
  });

  describe("#refresh", () => {
    it("should show deprecation notice and call correct method", () => {
      // arrange
      const client = createClient({ clientSecret });
      const spyOnShowDeprecationWarning = sandbox.stub(client.auth as any, "showDeprecationWarning");
      const spyOnRefresh = sandbox.stub(client.auth.tokenManager, "refresh");
      const timeout = 1234;

      // act
      client.auth.refresh(timeout);

      // assert
      sinon.assert.calledWith(spyOnShowDeprecationWarning, "refresh");
      sinon.assert.calledWith(spyOnRefresh, timeout);
    });
  });

  describe("#setToken", () => {
    it("should show deprecation notice and call correct method", () => {
      // arrange
      const client = createClient({ clientSecret });
      const spyOnShowDeprecationWarning = sandbox.stub(client.auth as any, "showDeprecationWarning");
      const spyOnSetToken = sandbox.stub(client.auth.tokenManager, "setToken");
      const accessToken = "at";
      const refreshToken = "rf";
      const tokenType = "tt";

      // act
      client.auth.setToken(accessToken, refreshToken, tokenType);

      // assert
      sinon.assert.calledWith(spyOnShowDeprecationWarning, "setToken");
      sinon.assert.calledWith(spyOnSetToken, accessToken, refreshToken, tokenType);
    });
  });

  describe("#token", () => {
    it("should show deprecation notice and call correct method", () => {
      // arrange
      const client = createClient({ clientSecret });
      const spyOnShowDeprecationWarning = sandbox.stub(client.auth as any, "showDeprecationWarning");
      const spyOnToken = sandbox.spy();
      sandbox.stub(client.auth.tokenManager, "token").get(spyOnToken);

      // act
      const token = client.auth.token;

      // assert
      sinon.assert.calledWith(spyOnShowDeprecationWarning, "token");
      sinon.assert.called(spyOnToken);
      expect(token).to.be.undefined;
    });
  });

});
