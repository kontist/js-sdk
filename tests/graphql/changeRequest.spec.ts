import { expect } from "chai";
import * as sinon from "sinon";

import { Client } from "../../lib";
import { ChangeRequest } from "../../lib/graphql/changeRequest";
import {
  AuthorizeChangeRequestResponse,
  ConfirmChangeRequestResponse,
} from "../../lib/graphql/schema";

describe("ChangeRequest", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;
  let changeRequest: ChangeRequest;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
    const redirectUri = "https://localhost:3000/auth/callback";
    const scopes = ["change_request"];
    const state = "25843739712322056";

    client = new Client({
      clientId,
      redirectUri,
      scopes,
      state,
    });

    changeRequest = new ChangeRequest(client.graphQL);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("#authorize", () => {
    it("should call rawQuery and return result", async () => {
      // arrange
      const authorizeChangeRequestRespone: AuthorizeChangeRequestResponse = {
        stringToSign: Date.now().toString(),
      };
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        authorizeChangeRequest: authorizeChangeRequestRespone,
      } as any);

      // act
      const result = await changeRequest.authorize({
        deviceId: "1",
        changeRequestId: Date.now().toString(),
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(authorizeChangeRequestRespone);
    });
  });

  describe("#confirm", () => {
    it("should call rawQuery and return result", async () => {
      // arrange
      const confirmChangeRequestRespone: ConfirmChangeRequestResponse = {
        success: true,
      };
      const changeRequest = new ChangeRequest(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        confirmChangeRequest: confirmChangeRequestRespone,
      } as any);

      // act
      const result = await changeRequest.confirm({
        deviceId: "1",
        changeRequestId: Date.now().toString(),
        signature: "test_signature",
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(confirmChangeRequestRespone);
    });
  });
});
