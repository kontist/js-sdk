import { expect } from "chai";
import * as sinon from "sinon";

import { TokenManager } from "../lib/auth/tokenManager";
import { KontistSDKError, UserUnauthorizedError } from "../lib/errors";
import { HttpRequest } from "../lib/request";
import { HttpMethod } from "../lib/types";

describe("HttpRequest", () => {
  let sandbox: sinon.SinonSandbox;
  let oldFetch: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    oldFetch = (global as any).fetch;
    (global as any).fetch = () => Promise.resolve();
  });

  afterEach(() => {
    (global as any).fetch = oldFetch;
    sandbox.restore();
  });

  describe("#fetch", () => {
    it("should fail if tokenManager has no token", async () => {
      // arrange
      const baseUrl = "http://localhost:3000";
      const tm = new TokenManager(baseUrl, { oauth2Client: {} as any });
      const request = new HttpRequest(baseUrl, tm);

      // act
      let error;
      try {
        await request.fetch("", HttpMethod.POST);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).to.be.an.instanceOf(UserUnauthorizedError);
    });

    it("should fail if response is not ok", async () => {
      // arrange
      const baseUrl = "http://localhost:3000";
      const tm = {
        token: { accessToken: "eyMockToken" },
      } as TokenManager;
      const request = new HttpRequest(baseUrl, tm);
      sandbox.stub(global as any, "fetch").resolves({
        ok: false,
        status: 123,
        statusText: "mock",
      } as Response);

      // act
      let error;
      try {
        await request.fetch("", HttpMethod.POST);
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).to.be.an.instanceOf(KontistSDKError);
      expect(error.status).to.eq(123);
      expect(error.message).to.eq("mock");
    });

    it("should return undefined if status is 204", async () => {
      // arrange
      const baseUrl = "http://localhost:3000";
      const tm = {
        token: { accessToken: "eyMockToken" },
      } as TokenManager;
      const request = new HttpRequest(baseUrl, tm);
      sandbox.stub(global as any, "fetch").resolves({
        ok: true,
        status: 204,
      } as Response);

      // act
      const result = await request.fetch("", HttpMethod.POST);

      // assert
      expect(result).to.be.undefined;
    });

    it("should call fetch with correct parameters", async () => {
      // arrange
      const baseUrl = "http://localhost:3000";
      const tm = {
        token: { accessToken: "eyMockToken" },
      } as TokenManager;
      const request = new HttpRequest(baseUrl, tm);
      const stubOnFetch = sandbox.stub(global as any, "fetch").resolves({
        ok: true,
        status: 204,
      } as Response);

      // act
      await request.fetch("/path", HttpMethod.POST, { test: 123 });

      // assert
      sinon.assert.calledWith(stubOnFetch, "http://localhost:3000/path", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer eyMockToken`,
        },
        body: '{"test":123}',
      });
    });

    it("should return object of json response", async () => {
      // arrange
      const baseUrl = "http://localhost:3000";
      const tm = {
        token: { accessToken: "eyMockToken" },
      } as TokenManager;
      const request = new HttpRequest(baseUrl, tm);
      sandbox.stub(global as any, "fetch").resolves({
        ok: true,
        json: () => Promise.resolve({ test: 123 }),
      } as Response);

      // act
      const result = await request.fetch("", HttpMethod.POST);

      // assert
      expect(result).to.be.eql({ test: 123 });
    });
  });
});
