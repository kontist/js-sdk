import { expect } from "chai";
import * as sinon from "sinon";

import { Client } from "../../lib";
import { Subscription } from "../../lib/graphql/subscription";
import {
  PurchaseType,
  UpdateSubscriptionPlanResult,
} from "../../lib/graphql/schema";

describe("Subscription", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;

  beforeEach(() => {
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

  describe("#fetch", () => {
    describe("when there are plans", () => {
      it("should call rawQuery and return results", async () => {
        // arrange
        const couponCode = "free100";
        const plans = [
          {
            type: "BASIC",
            title: "Free",
            subtitle: "/ month plus VAT for the first year, then much more expensive",
            button: "Open Free",
            featuresToggleLabel: "All Kontist Free features",
            featureGroups: [
              {
                title: null,
                features: [
                  { title: "Unlimited SEPA transfers" },
                  { title: "Virtual Card" },
                ],
              },
            ],
            fee: {
              amount: 0,
              fullAmount: null,
              discountPercentage: null,
            },
          },
        ];
        const subscription = new Subscription(client.graphQL);
        const spyOnRawQuery = sandbox
          .stub(client.graphQL, "rawQuery")
          .resolves({
            viewer: {
              subscriptionPlans: {
                plans,
                couponCode: "someOtherCode",
              },
            },
          } as any);

        // act
        const result = await subscription.fetch(couponCode);

        // assert
        sinon.assert.calledOnce(spyOnRawQuery);
        expect(result).to.deep.eq({
          plans,
          couponCode: "someOtherCode",
        });
      });
    });
  });

  describe("#updatePlan", () => {
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
      const result = await subscription.updatePlan({
        newPlan: PurchaseType.Premium,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(updateSubscriptionPlanData);
    });
  });

  describe("#fetchPurchases", () => {
    describe("when user is subscribed to plan", () => {
      it("should call rawQuery and return results", async () => {
        // arrange
        const plans = [
          {
            type: "accounting",
            state: "processed",
          },
        ];
        const subscription = new Subscription(client.graphQL);
        const spyOnRawQuery = sandbox
          .stub(client.graphQL, "rawQuery")
          .resolves({
            viewer: {
              subscriptions: plans,
            },
          } as any);

        // act
        const result = await subscription.fetchPurchases();

        // assert
        sinon.assert.calledOnce(spyOnRawQuery);
        expect(result).to.deep.eq(plans);
      });
    });

    describe("when use is not subscribed to any plan", () => {
      it("should call rawQuery and return empty array", async () => {
        // arrange
        const subscription = new Subscription(client.graphQL);
        const spyOnRawQuery = sandbox
          .stub(client.graphQL, "rawQuery")
          .resolves({
            viewer: {
              subscriptions: null,
            },
          } as any);

        // act
        const result = await subscription.fetchPurchases();

        // assert
        sinon.assert.calledOnce(spyOnRawQuery);
        expect(result).to.deep.eq([]);
      });
    });
  });

  describe("#makePurchase", () => {
    it("should call rawQuery and return results", async () => {
      // arrange
      const couponCode = "lexoffice100";
      const type = PurchaseType.Accounting;
      const subscriptionResult = {
        type: "accounting",
        state: "processed",
      };
      const subscription = new Subscription(client.graphQL);
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        subscribeToPlan: subscriptionResult,
      } as any);

      // act
      const result = await subscription.makePurchase(type, couponCode);

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(subscriptionResult);
    });
  });
});
