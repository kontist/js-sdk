import { Model } from "./model";
import { ResultPage } from "./resultPage";
import {
  BusinessAddress as BusinessAddressModel,
  Query,
  MutationCreateBusinessAddressArgs,
  UserLastBusinessAddressArgs,
 } from "./schema";

const GET_BUSINESS_ADDRESSES_QUERY = `
  {
    viewer {
      businessAddresses {
        id
        street
        postCode
        city
        movingDate
      }
    }
  }
`;

const GET_LAST_BUSINESS_ADDRESS_QUERY = `
  query($date: DateTime!) {
    viewer {
      lastBusinessAddress(date: $date) {
        id
        street
        postCode
        city
        movingDate
      }
    }
  }
`;

const CREATE_BUSINESS_ADDRESS_MUTATION = `
  mutation(
    $payload: CreateBusinessAddressInput!
  ) {
    createBusinessAddress(payload: $payload) {
      id
      street
      postCode
      city
      movingDate
    }
  }
`;

export class BusinessAddress extends Model<BusinessAddressModel | null> {
  /**
   * Fetches all business addresses belonging to the current user
   *
   * @returns result page
   */
  public async fetch(): Promise<ResultPage<BusinessAddressModel>> {
    const result: Query = await this.client.rawQuery(GET_BUSINESS_ADDRESSES_QUERY);
    const businessAddresses = result.viewer?.businessAddresses ?? [];

    const pageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return new ResultPage(this, businessAddresses, pageInfo, {});
  }

  /**
   * Fetches last business addresses belonging to the current user in a specific date
   *
   * @returns result page
   */
  public async lastBusinessAddress(args: UserLastBusinessAddressArgs): Promise<BusinessAddressModel | null> {
      const result: Query = await this.client.rawQuery(GET_LAST_BUSINESS_ADDRESS_QUERY, args);
      const businessAddress = result.viewer?.lastBusinessAddress ?? null;

      return businessAddress;
    }

  /**
   * Creates a business address
   *
   * @param args query parameters
   * @returns the newly created business address
   */
  public async create(args: MutationCreateBusinessAddressArgs): Promise<BusinessAddressModel> {
    const result = await this.client.rawQuery(CREATE_BUSINESS_ADDRESS_MUTATION, args);
    return result.createBusinessAddress;
  }
}