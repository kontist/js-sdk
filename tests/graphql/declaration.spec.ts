import {expect} from "chai";
import * as sinon from "sinon";

import {Client} from "../../lib";
import {Declaration} from "../../lib/graphql/declaration";
import {
  Declaration as DeclarationModel,
  DeclarationType,
} from "../../lib/graphql/schema";

describe("Declaration", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;
  let declaration: Declaration;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
    const redirectUri = "https://localhost:3000/auth/callback";
    const state = "25843739712322056";
    const scopes = [""];

    client = new Client({
      clientId,
      redirectUri,
      scopes,
      state,
    });

    declaration = new Declaration(client.graphQL);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("#fetch", () => {
    it("should call rawQuery and return result", async () => {
      // arrange
      const declarationsRespone: DeclarationModel[] = [
        {
          id: 1,
          amount: 5,
          period: "02",
          year: 2021,
        },
      ];
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            declarations: declarationsRespone,
          },
        },
      } as any);

      // act
      const result = await declaration.fetch({
        type: DeclarationType.UStVa,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(declarationsRespone);
    });

    it("should call rawQuery and return empty array for missing account", async () => {
      // arrange
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      // act
      const result = await declaration.fetch({
        type: DeclarationType.UStVa,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq([]);
    });
  });

  describe("#getPdfUrl", () => {
    it("should call rawQuery and return result", async () => {
      // arrange
      const getPdfUrlRespone = "https://amazonaws.com/example.pdf";
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            declarationPdfUrl: getPdfUrlRespone,
          },
        },
      } as any);

      // act
      const result = await declaration.getPdfUrl({
        id: 1,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(getPdfUrlRespone);
    });

    it("should call rawQuery and return result for missing account", async () => {
      // arrange
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      // act
      const result = await declaration.getPdfUrl({
        id: 1,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(null);
    });
  });
});
