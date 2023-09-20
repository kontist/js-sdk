import { GraphQLClient } from "./client";
import {
  MutationUpdateSubscriptionPlanArgs,
  PurchaseType,
  UpdateSubscriptionPlanResult,
  UserSubscription,
  SubscriptionPlansResponse,
} from "./schema";

const UPDATE_PLAN = `mutation updatePlan(
  $newPlan: PurchaseType!
  $couponCode: String
) {
  updateSubscriptionPlan(newPlan: $newPlan, couponCode: $couponCode) {
    newPlan
    previousPlans
    updateActiveAt
    hasCanceledDowngrade
    hasOrderedPhysicalCard
    couponCode
  }
}`;

const FETCH_PLANS = `query fetchPlans ($couponCode: String) {
  viewer {
    subscriptionPlans (couponCode: $couponCode) {
      couponCode
      couponValidFor
      plans {
        type
        title
        description
        subtitle
        button
        featuresToggleLabel
        featureGroups {
          title
          features {
            title
          }
        }
        fee {
          amount
          discountAmount
          fullAmount
          discountPercentage
        }
      }
    }
  }
}`;

const FETCH_PURCHASES = `query fetchUserPlans {
  viewer {
    subscriptions {
      type
      state
    }
  }
}`;

const SUBSCRIBE_TO_PLAN = `mutation SubscribeToPlan($type: PurchaseType!, $couponCode: String) {
  subscribeToPlan(type: $type, couponCode: $couponCode) {
    type,
    state
  }
}`;

export class Subscription {
  constructor(protected client: GraphQLClient) {}

  /**
   * Fetches all available subscription plans for user
   *
   * @param couponCode  coupon code
   * @returns     list of plans
   */
  public async fetch(
    couponCode?: string
  ): Promise<SubscriptionPlansResponse | undefined> {
    const result = await this.client.rawQuery(FETCH_PLANS, { couponCode });
    return result.viewer?.subscriptionPlans;
  }

  /**
   * Fetches active subscription plans for user
   *
   * @returns     list of active subscription types
   */
  public async fetchPurchases(): Promise<UserSubscription[]> {
    const result = await this.client.rawQuery(FETCH_PURCHASES);
    return result.viewer?.subscriptions ?? [];
  }

  /**
   * Subscribe user to a plan
   *
   * @param type  subscription type
   * @param couponCode  coupon code
   * @returns     subscribe result
   */
  public async makePurchase(
    type: PurchaseType,
    couponCode?: string
  ): Promise<UserSubscription> {
    const result = await this.client.rawQuery(SUBSCRIBE_TO_PLAN, {
      type,
      couponCode,
    });
    return result.subscribeToPlan;
  }

  /**
   * Updates subscription plan
   *
   * @param args  query parameters including new plan name
   * @returns     result of update
   */
  public async updatePlan(
    args: MutationUpdateSubscriptionPlanArgs
  ): Promise<UpdateSubscriptionPlanResult> {
    const result = await this.client.rawQuery(UPDATE_PLAN, args);
    return result.updateSubscriptionPlan;
  }
}
