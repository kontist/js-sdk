import { User as UserModel, Query } from "./schema";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { GET_USER } from "./queries";

export class User extends Model<UserModel> {
  async fetch(): Promise<ResultPage<UserModel>> {
    throw new Error("You are allowed only to fetch your details.");
  }

  /**
   * Returns user details
   *
   * @returns current user details
   */
  async get(): Promise<UserModel> {
    const result: Query = await this.client.rawQuery(GET_USER);
    return result.viewer;
  }
}
