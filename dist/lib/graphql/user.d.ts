import { User as UserModel } from "./schema";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
export declare class User extends Model<UserModel> {
    fetch(): Promise<ResultPage<UserModel>>;
    /**
     * Returns user details
     *
     * @returns current user details
     */
    get(): Promise<UserModel>;
}
