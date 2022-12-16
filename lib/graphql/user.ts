import { MutationUserConfirmationArgs, Query, User as UserModel } from "./schema";

import { KontistSDKError } from "../errors";
import { Model } from "./model";
import { ResultPage } from "./resultPage";

const GET_USER = `query getUser {
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
    screeningStatus
    screeningProgress
    riskClassificationStatus
    customerVettingStatus
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

const CREATE_ALIAS = `mutation($alias: String!, $hash: String!) {
  createUserEmailAlias(alias: $alias, hash: $hash) {
    success
  }
}`;

const USER_CONFIRMATION = `mutation userConfirmation(
  $confirmation: UserConfirmation!
  $year: Int
) {
 userConfirmation(
   confirmation: $confirmation
   year: $year
  ) {
    success
  }
}`

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

  /**
   * Creates an email alias
   *
   * @returns boolean success value
   */
  public async createEmailAlias(alias: string, hash: string): Promise<boolean> {
    const result = await this.client.rawQuery(CREATE_ALIAS, { alias, hash });
    return result.createUserEmailAlias.success;
  }

  /**
   * Confirms user decision
   *
   * @returns boolean success value
   */
  public async confirm(args: MutationUserConfirmationArgs): Promise<boolean> {
      const result = await this.client.rawQuery(USER_CONFIRMATION, args);
      return result.userConfirmation.success;
    }
}
