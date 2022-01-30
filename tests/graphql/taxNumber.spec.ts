import { expect } from "chai";
import * as sinon from "sinon";

import { Client } from "../../lib";
import { TaxNumberType } from "../../lib/graphql/schema";
import { TaxNumber } from "../../lib/graphql/taxNumber";

const taxNumberData = {
  id: "921be5e1-cefb-4b91-9633-fcadca94bd72",
  type: TaxNumberType.Personal,
  taxNumber: "2388081508158",
  modificationDate: new Date("2022-01-01"),
  description: "personal tax number",
};

describe("TaxNumber", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;

  beforeEach(async () => {
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
    it("should call rawQuery and return all tax numbers details", async () => {
      // arrange
      const taxNumbersData = [
        taxNumberData,
        { ...taxNumberData, id: "b9ff9d3d-3ab7-452e-a16c-e1611fe443aa" },
      ];
      const taxNumber = new TaxNumber(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          taxNumbers: [
            taxNumberData,
            { ...taxNumberData, id: "b9ff9d3d-3ab7-452e-a16c-e1611fe443aa" },
          ],
        }
      } as any);
      
      // act
      const result = await taxNumber.fetch();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq({
        items: taxNumbersData,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });    
    });
  });

  describe("#create", () => {
    it("should call rawQuery and return newly created tax number details", async () => {
      // arrange
      const taxNumber = new TaxNumber(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        createTaxNumber: taxNumberData,
      } as any);

      // act
      const result = await taxNumber.create({
        payload: {
          type: TaxNumberType.Personal,
          taxNumber: "2388081508158",
          modificationDate: new Date("2022-01-01"),
          description: "personal tax number",
        }
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(taxNumberData);
    });
  });

  describe("#update", () => {
    it("should call rawQuery and return the updated tax number details", async () => {
      // arrange
      const updatedTaxNumberData = {
        ...taxNumberData,
        taxNumber: "5600081508154",
        type: TaxNumberType.Business,
        description: "updated tax number",
      };
      const taxNumber = new TaxNumber(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        updateTaxNumber: updatedTaxNumberData,
      } as any);
      
      // act
      const result = await taxNumber.update({
        id: taxNumberData.id,
        payload: {
          taxNumber: "5600081508154",
          type: TaxNumberType.Business,
          description: "updated tax number",
        }
      });

      // result
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(updatedTaxNumberData);
    });
  });

  describe("#delete", () => {
    it("should call rawQuery and return a MutationResult", async () => {
      // arrange
      const taxNumber = new TaxNumber(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        deleteTaxNumber: {
          success: true,
        },
      } as any);

      // act
      const result = await taxNumber.delete({
        id: taxNumberData.id,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq({ success: true });
    });
  });
});
