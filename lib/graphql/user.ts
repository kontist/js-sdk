import { KontistSDKError } from "../errors";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { Query, User as UserModel } from "./schema";

const GET_USER = `query {
  viewer {
    birthDate
    birthPlace
    businessPurpose
    city
    companyType
    country
    createdAt
    economicSector
    email
    firstName
    gender
    identificationLink
    identificationStatus
    isUSPerson
    lastName
    mobileNumber
    nationality
    otherEconomicSector
    postCode
    publicId
    referralCode
    street
    taxPaymentFrequency
    taxRate
    untrustedPhoneNumber
    vatNumber
    vatPaymentFrequency
    vatRate
  }
}`;

export class User extends Model<UserModel> {
  public async fetch(): Promise<ResultPage<UserModel>> {
    throw new KontistSDKError({ message: "You are allowed only to fetch your details." });
  }

  /**
   * Returns user details
   *
   * @returns current user details
   */
  public async get(): Promise<UserModel | undefined | null> {
    const result: Query = await this.client.rawQuery(GET_USER);
    return result.viewer;
  }
}
