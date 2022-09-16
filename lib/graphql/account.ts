import { KontistSDKError } from "../errors";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { Account as AccountModel, Query, AccountStats, SolarisAccountBalance } from "./schema";

const GET_ACCOUNT = `query {
  viewer {
    mainAccount {
      iban
      bic
      balance
      availableBalance
      cardHolderRepresentation
      cardHolderRepresentations
      hasPendingCardFraudCase
      canCreateOverdraft
    }
  }
}`;
const GET_ACCOUNT_STATS = `query {
  viewer {
    mainAccount {
      stats {
        accountBalance
        main
        yours
        unknown
        vatAmount
        vatTotal
        vatMissing
        taxCurrentYearAmount
        taxPastYearsAmount
        taxTotal
        taxMissing
      }
    }
  }
}`;

const GET_SOLARIS_BALANCE = `query {
  viewer {
    mainAccount {
      solarisBalance {
          balance {
            value
            currency
            unit
          }
          availableBalance {
            value
            currency
            unit
          }
          seizureProtection {
            currentBlockedAmount  {
              value
              currency
              unit
            }
            protectedAmount  {
              value
              currency
              unit
            }
            protectedAmountExpiring  {
              value
              currency
              unit
            }
            protectedAmountExpiringDate
          }
        }
      }
    }
  }
`;

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

  /**
   * Returns account balance from solaris, including seizure_protection if exists
   *
   * @returns main account balance from solaris, including seizure_protection if exists
   */
  public async getSolarisBalance(): Promise<SolarisAccountBalance | null> {
    const result: Query = await this.client.rawQuery(GET_SOLARIS_BALANCE);
    return result.viewer?.mainAccount?.solarisBalance ?? null;
  }
}
