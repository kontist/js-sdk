import { GraphQLClient } from "./client";
import {
  MutationUpdateSubscriptionPlanArgs,
  UpdateSubscriptionPlanResult,
} from "./schema";

const UPDATE_PLAN = `mutation updatePlan(
  $newPlan: PurchaseType!
) {
  updateSubscriptionPlan(newPlan: $newPlan) {
    newPlan
    previousPlans
    updateActiveAt
    hasCanceledDowngrade
    hasOrderedPhysicalCard
  }
}`;

export class Subscription {
  constructor(protected client: GraphQLClient) {}

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
