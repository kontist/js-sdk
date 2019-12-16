import { Account as AccountModel } from "./schema";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
export declare class Account extends Model<AccountModel> {
    fetch(): Promise<ResultPage<AccountModel>>;
    /**
     * Returns user account details
     *
     * @returns current user account details
     */
    get(): Promise<AccountModel | null>;
}
