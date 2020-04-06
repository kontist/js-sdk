import { expect } from "chai";
import * as sinon from "sinon";

import { Client } from "../../lib";
import { Subscription } from "../../lib/graphql/subscription";
import { PurchaseType, UpdateSubscriptionPlanResult } from "../../lib/graphql/schema";


describe("Subscription", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
    const redirectUri = "https://localhost:3000/auth/callback";
    const scopes = ["subscriptions"];
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

  describe("#updateSubscriptionPlan", () => {
    it("should call rawQuery and return result", async () => {
      // arrange
      const updateSubscriptionPlanData: UpdateSubscriptionPlanResult = {
        newPlan: PurchaseType.Premium,
        previousPlans: [PurchaseType.Basic],
        hasOrderedPhysicalCard: true,
        updateActiveAt: "2020-04-06T14:48:00.916Z",
        hasCanceledDowngrade: false,
      };
      const subscription = new Subscription(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        updateSubscriptionPlan: updateSubscriptionPlanData,
      } as any);

      // act
      const result = await subscription.updateSubscriptionPlan({
        newPlan: PurchaseType.Premium,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(updateSubscriptionPlanData);
    });
  });
});
