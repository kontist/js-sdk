import * as sinon from "sinon";
import { expect } from "chai";

import { Client } from "../../lib";
import { KontistSDKError } from "../../lib/errors";
import { User } from "../../lib/graphql/user";
import { UserConfirmation } from "../../lib/graphql/schema";

describe("User", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
    const redirectUri = "https://localhost:3000/auth/callback";
    const scopes = ["transactions"];
    const state = "25843739712322056";

    client = new Client({
      clientId,
      redirectUri,
      scopes,
      state,
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("#fetch", () => {
    it("should fail", async () => {
      // arrange
      const user = new User(client.graphQL);

      // act
      let error: any;
      try {
        await user.fetch();
      } catch (e) {
        error = e;
      }

      // assert
      expect(error).to.be.an.instanceOf(KontistSDKError);
      expect(error.message).to.eq("You are allowed only to fetch your details.");
    });
  });

  describe("#get", () => {
    it("should call rawQuery and return mainAccount", async () => {
      // arrange
      const user = new User(client.graphQL);
      const viewer = { email: "test@kontist.com" };
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({ viewer } as any);

      // act
      const result = await user.get();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(viewer);
    });

  });

  describe("#createEmailAlias", () => {
    it("should call rawQuery and return success", async () => {
      // arrange
      const alias = "tester@kontist.com";
      const hash = "12345678";
      const user = new User(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({ createUserEmailAlias: { success: true } } as any);

      // act
      const result = await user.createEmailAlias(alias, hash);

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(true);
    });

  });

  describe("#confirm", () => {
    Object.values(UserConfirmation).forEach(confirmation => {
      describe(`for ${confirmation}`, () => {  
        it("should call rawQuery and return success", async () => {
          // arrange
          const user = new User(client.graphQL);
          const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({ userConfirmation: { success: true } } as any);
    
          // act
          const result = await user.confirm({ confirmation, year: 2021 });
    
          // assert
          sinon.assert.calledOnce(spyOnRawQuery);
          expect(result).to.eq(true);
        });
      })
    })
  });
});
