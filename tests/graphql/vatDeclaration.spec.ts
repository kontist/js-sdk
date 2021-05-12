import {expect} from "chai";
import * as sinon from "sinon";

import {Client} from "../../lib";
import {VatDeclaration} from "../../lib/graphql/vatDeclaration";
import {
  VatDeclaration as VatDeclarationModel,
  VatDeclarationPdf,
} from "../../lib/graphql/schema";

describe("VatDeclaration", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;
  let vatDeclaration: VatDeclaration;

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

    vatDeclaration = new VatDeclaration(client.graphQL);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("#fetch", () => {
    it("should call rawQuery and return result", async () => {
      // arrange
      const vatDeclarationsRespone: VatDeclarationModel[] = [
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
            vatDeclarations: vatDeclarationsRespone,
          },
        },
      } as any);

      // act
      const result = await vatDeclaration.fetch();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq({
        items: vatDeclarationsRespone,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });
  });

  describe("#getPdf", () => {
    it("should call rawQuery and return result", async () => {
      // arrange
      const getPdfRespone: VatDeclarationPdf = {
        url: "https://amazonaws.com/example.pdf",
      };
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            vatDeclarationPdf: getPdfRespone,
          },
        },
      } as any);

      // act
      const result = await vatDeclaration.getPdf({
        id: "1",
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(getPdfRespone);
    });
  });
});
