import { GraphQLClient } from "./client";
import {
  MutationUpdateSubscriptionPlanArgs,
  SubscriptionPlan,
  UpdateSubscriptionPlanResult,
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

const FETCH_PLANS = `query FetchPlans ($couponCode: String) {
  viewer {
    availablePlans (couponCode: $couponCode) {
      type
      subtitle
      fee {
        amount
        fullAmount
        discountPercentage
      }
      title
      description
      button
      featuresToggleLabel
      featureGroups {
        title
        icon {
          uri
        }
        features {
          title
          icon {
            uri
          }
        }
      }
    }
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
  public async fetch(couponCode?: string): Promise<SubscriptionPlan[]> {
    const result = await this.client.rawQuery(FETCH_PLANS, { couponCode });
    return result.viewer?.availablePlans ?? [];
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
