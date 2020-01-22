import { expect } from "chai";
import { JSDOM } from "jsdom";
import * as sinon from "sinon";
import { RenewTokenError } from "../../lib/errors";
import { authorizeSilently } from "../../lib/utils";

describe("authorizeSilently", () => {
  let addEventListenerSpy: any;
  let removeEventListenerSpy: any;

  const assertListeners = () => {
    it("should properly setup and teardown message listeners", () => {
      expect(addEventListenerSpy.callCount).to.equal(1);
      expect(addEventListenerSpy.getCall(0).args[0]).to.equal("message");

      expect(removeEventListenerSpy.callCount).to.equal(1);
      expect(removeEventListenerSpy.getCall(0).args[0]).to.equal("message");
    });
  };

  before(() => {
    const jsdom = new JSDOM("<html><body></body></html>");
    (global as any).window = jsdom.window;
    (global as any).document = window.document;
    addEventListenerSpy = sinon.spy(window, "addEventListener");
    removeEventListenerSpy = sinon.spy(window, "removeEventListener");
  });

  describe("when receiving a message with an authorization code in the response", () => {
    let result: any;
    const code = "some-random-code";

    before(async () => {
      addEventListenerSpy.resetHistory();
      removeEventListenerSpy.resetHistory();

      setTimeout(() => {
        window.postMessage({ response: { code } }, "*");
      }, 100);

      result = await authorizeSilently("http://some.url", "", 10000);
    });

    it("should return the authorization code", () => {
      expect(result).to.equal(code);
    });

    assertListeners();
  });

  describe("when receiving an error", () => {
    let error: any;
    const expectedError = "some-error";

    before(async () => {
      addEventListenerSpy.resetHistory();
      removeEventListenerSpy.resetHistory();

      setTimeout(() => {
        window.postMessage({ error: expectedError }, "*");
      }, 100);

      try {
        await authorizeSilently("http://some.url", "", 10000);
      } catch (err) {
        error = err;
      }
    });

    it("should reject with the returned error", () => {
      expect(error).to.equal(expectedError);
    });

    assertListeners();
  });

  describe("when receiving an invalid message", () => {
    let error: any;

    before(async () => {
      addEventListenerSpy.resetHistory();
      removeEventListenerSpy.resetHistory();

      setTimeout(() => {
        window.postMessage({ invalid: "response" }, "*");
      }, 100);

      try {
        await authorizeSilently("http://some.url", "", 10000);
      } catch (err) {
        error = err;
      }
    });

    it("should throw a RenewTokenError", () => {
      expect(error).to.be.an.instanceof(RenewTokenError);
      expect(error.message).to.equal("Invalid message received from server");
    });

    assertListeners();
  });

  describe("when receiving an empty message", () => {
    let error: any;

    before(async () => {
      addEventListenerSpy.resetHistory();
      removeEventListenerSpy.resetHistory();

      setTimeout(() => {
        window.postMessage(null, "*");
      }, 100);

      try {
        await authorizeSilently("http://some.url", "", 10000);
      } catch (err) {
        error = err;
      }
    });

    it("should throw a RenewTokenError", () => {
      expect(error).to.be.an.instanceof(RenewTokenError);
      expect(error.message).to.equal("Invalid message received from server");
    });

    assertListeners();
  });

  describe("when the message origin is not the expected one", () => {
    let error: any;

    before(async () => {
      addEventListenerSpy.resetHistory();
      removeEventListenerSpy.resetHistory();

      setTimeout(() => {
        window.postMessage({ response: { code: "some-random-code" } }, "*");
      }, 100);

      try {
        await authorizeSilently(
          "http://some.url",
          "http://some.wrong.origin",
          200,
        );
      } catch (err) {
        error = err;
      }
    });

    it("should throw a RenewTokenError", () => {
      expect(error).to.be.an.instanceof(RenewTokenError);
      expect(error.message).to.equal(
        "Server did not respond with authorization code, aborting.",
      );
    });

    assertListeners();
  });

  after(() => {
    (global as any).window = undefined;
    (global as any).document = undefined;
    addEventListenerSpy.restore();
    removeEventListenerSpy.restore();
  });
});
