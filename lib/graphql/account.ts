import { KontistSDKError } from "../errors";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { Account as AccountModel, Query } from "./schema";

const GET_ACCOUNT = `query {
  viewer {
    mainAccount {
      iban
      balance
    }
  }
}`;

export class Account extends Model<AccountModel> {
  public async fetch(): Promise<ResultPage<AccountModel>> {
    throw new KontistSDKError({ message: "You are allowed only to fetch your account details." });
  }

  /**
   * Returns user account details
   *
   * @returns current user account details
   */
  public async get(): Promise<AccountModel | null> {
    const result: Query = await this.client.rawQuery(GET_ACCOUNT);
    return result.viewer.mainAccount || null;
  }
}
