import { Model } from "./model";
import { ResultPage } from "./resultPage";
import {
  TaxNumber as TaxNumberModel,
  Query,
  MutationCreateTaxNumberArgs,
  MutationUpdateTaxNumberArgs,
  MutationDeleteTaxNumberArgs,
  MutationResult,
 } from "./schema";

const GET_TAX_NUMBERS_QUERY = `
  {
    viewer {
      taxNumbers {
        id
        type
        taxNumber
        modificationDate
        description
      }
    }
  }
`;

const UPDATE_TAX_NUMBER_MUTATION = `
  mutation(
    $id: ID!,
    $payload: UpdateTaxNumberInput!
  ) {
    updateTaxNumber(id: $id, payload: $payload) {
      id
      type
      taxNumber
      modificationDate
      description
    }
  }
`;

const CREATE_TAX_NUMBERS_MUTATION = `
  mutation(
    $payload: CreateTaxNumberInput!
  ) {
    createTaxNumber(payload: $payload) {
      id
      type
      taxNumber
      modificationDate
      description
    }
  }
`;

const DELETE_TAX_NUMBER_MUTATION = `
  mutation(
    $id: ID!
  ) {
    deleteTaxNumber(id: $id) {
      success
    }
  }
`;

export class TaxNumber extends Model<TaxNumberModel | null> {
  /**
   * Fetches all tax numbers belonging to the current user
   *
   * @returns result page
   */
  public async fetch(): Promise<ResultPage<TaxNumberModel>> {
    const result: Query = await this.client.rawQuery(GET_TAX_NUMBERS_QUERY);
    const taxNumbers = result.viewer?.taxNumbers ?? [];

    const pageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return new ResultPage(this, taxNumbers, pageInfo, {});
  }

  /**
   * Create a tax number
   *
   * @param args query parameters
   * @returns the newly created tax number
   */
  public async create(args: MutationCreateTaxNumberArgs): Promise<TaxNumberModel> {
    const result = await this.client.rawQuery(CREATE_TAX_NUMBERS_MUTATION, args);
    return result.createTaxNumber;
  }

  /**
   * Update a tax number
   * @param args query parameter including tax number ID
   * @returns update tax number details
   */
  public async update(args: MutationUpdateTaxNumberArgs): Promise<TaxNumberModel> {
    const result = await this.client.rawQuery(UPDATE_TAX_NUMBER_MUTATION, args);
    return result.updateTaxNumber;
  }

  /**
   * Delete a tax number
   *
   * @param args tax number ID
   * @returns a MutationResult
   */
  public async delete(args: MutationDeleteTaxNumberArgs): Promise<MutationResult> {
    const result = await this.client.rawQuery(DELETE_TAX_NUMBER_MUTATION, args);
    return result.deleteTaxNumber;
  }
}