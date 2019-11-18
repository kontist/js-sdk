import { User as UserModel, Query } from "./schema";
import { Model } from "./model";
import { ResultPage } from "./resultPage";
import { KontistSDKError } from "../errors";

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
    taxCutoffLine
    taxPaymentFrequency
    taxRate
    untrustedPhoneNumber
    vatCutoffLine
    vatNumber
    vatPaymentFrequency
    vatRate
  }
}`;

export class User extends Model<UserModel> {
  async fetch(): Promise<ResultPage<UserModel>> {
    throw new KontistSDKError({ message: "You are allowed only to fetch your details." });
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
