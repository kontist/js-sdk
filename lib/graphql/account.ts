import { Account as AccountModel, Query } from "./schema";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { GET_ACCOUNT } from "./queries";

export class Account extends Model<AccountModel> {
  async fetch(): Promise<ResultPage<AccountModel>> {
    throw new Error("You are allowed only to fetch your account details.");
  }

  /**
   * Returns user account details
   *
   * @returns current user account details
   */
  async get(): Promise<AccountModel | null> {
    const result: Query = await this.client.rawQuery(GET_ACCOUNT);
    return result.viewer.mainAccount || null;
  }
}
