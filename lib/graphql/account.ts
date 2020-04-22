import { KontistSDKError } from "../errors";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { Account as AccountModel, Query, AccountStats } from "./schema";

const GET_ACCOUNT = `query {
  viewer {
    mainAccount {
      iban
      balance
      cardHolderRepresentation
      cardHolderRepresentations
    }
  }
}`;
const GET_ACCOUNT_STATS = `query {
  viewer {
    mainAccount {
      accountStats {
        accountBalance
        main
        yours
        unknown
        vatAmount
        vatTotal
        vatMissing
        taxCurrentYearAmount
        taxPastYearAmount
        taxTotal
        taxMissing
      }
    }
  }
}`;

export class Account extends Model<AccountModel> {
  public async fetch(): Promise<ResultPage<AccountModel>> {
    throw new KontistSDKError({
      message: "You are allowed only to fetch your account details.",
    });
  }

  /**
   * Returns user account details
   *
   * @returns current user account details
   */
  public async get(): Promise<AccountModel | null> {
    const result: Query = await this.client.rawQuery(GET_ACCOUNT);
    return result.viewer?.mainAccount || null;
  }

  /**
   * Different statistics to the users account balance e.g. yours, unknown, vatTotal, taxMissing ...
   *
   * @returns current user account statistics
   */
  public async getStats(): Promise<AccountStats | null> {
    const result: Query = await this.client.rawQuery(GET_ACCOUNT_STATS);
    return result.viewer?.mainAccount?.stats ?? null;
  }
}
