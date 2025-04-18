import { expect } from "chai";
import * as sinon from "sinon";

import { Client } from "../../lib";
import { BusinessAddress } from "../../lib/graphql/businessAddress";

const businessAddressData = {
  id: "921be5e1-cefb-4b91-9633-fcadca94bd72",
  street: "Riccarton Av. 1212",
  postCode: "RD88990",
  city: "Christpost",
  movingDate: new Date("2019-01-01"),
};

describe("BusinessAddress", () => {
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
    it("should call rawQuery and return all business addresses details", async () => {
      // arrange
      const businessAddressesData = [
        businessAddressData,
        { ...businessAddressData, id: "b9ff9d3d-3ab7-452e-a16c-e1611fe443aa" },
      ];
      const businessAddress = new BusinessAddress(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          businessAddresses: [
            businessAddressData,
            {
              ...businessAddressData,
              id: "b9ff9d3d-3ab7-452e-a16c-e1611fe443aa",
            },
          ],
        },
      } as any);

      // act
      const result = await businessAddress.fetch();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq({
        items: businessAddressesData,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });
    });

    it("should return empty list if viewer.businessAddresses is undefined", async () => {
      const businessAddress = new BusinessAddress(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      const result = await businessAddress.fetch();

      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result.items).to.deep.eq([]);
      expect(result.pageInfo).to.deep.eq({
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });

  describe("#fetch last business address", () => {
    it("should call rawQuery and return the business addresses details based on input date", async () => {
      // arrange
      const businessAddress = new BusinessAddress(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          lastBusinessAddress: { businessAddressData },
        },
      } as any);

      // act
      const result = await businessAddress.lastBusinessAddress();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq({ businessAddressData });
    });

    it("should return null if viewer.lastBusinessAddress is not present", async () => {
      const businessAddress = new BusinessAddress(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      const result = await businessAddress.lastBusinessAddress();

      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(null);
    });
  });

  describe("#create", () => {
    it("should call rawQuery and return newly created business address details", async () => {
      // arrange
      const businessAddress = new BusinessAddress(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        createBusinessAddress: businessAddressData,
      } as any);

      // act
      const result = await businessAddress.create({
        payload: {
          street: "Riccarton Av. 1212",
          postCode: "RD88990",
          city: "Christpost",
          movingDate: new Date("2019-01-01"),
        },
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(businessAddressData);
    });

    it("should return undefined if createBusinessAddress is not returned in result", async () => {
      const businessAddress = new BusinessAddress(client.graphQL);
      const spyOnRawQuery = sandbox
        .stub(client.graphQL, "rawQuery")
        .resolves({} as any);

      const result = await businessAddress.create({
        payload: {
          street: "Nope Street",
          postCode: "00000",
          city: "Nulltown",
          movingDate: new Date("2000-01-01"),
        },
      });

      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.be.undefined;
    });
  });
});
