import { Model } from "./model";
import { ResultPage } from "./resultPage";

import {
  Query,
  VatDeclarationPdf,
  AccountVatDeclarationPdfArgs,
  VatDeclaration as VatDeclarationModel,
} from "./schema";

const FETCH_DECLARATIONS = `
  query {
    viewer {
      mainAccount {
        vatDeclarations {
          id
          amount
          period
          year
        }
      }
    }
  }
`;

const GET_DECLARATION_PDF = `
  query GetDeclarationPdf ($id: ID!) {
    viewer {
      mainAccount {
        vatDeclarationPdf(id: $id) {
          url
        }
      }
    }
  }
`;

export class VatDeclaration extends Model<VatDeclarationModel> {
  public async fetch(): Promise<ResultPage<VatDeclarationModel>> {
    const result: Query = await this.client.rawQuery(FETCH_DECLARATIONS);

    const declarations = result.viewer?.mainAccount?.vatDeclarations || [];

    // declarations resolver is not paginated
    const pageInfo = {
      hasNextPage: false,
      hasPreviousPage: false,
    };

    return new ResultPage(this, declarations, pageInfo, {});
  }

  public async getPdf(
    args: AccountVatDeclarationPdfArgs
  ): Promise<VatDeclarationPdf | null> {
    const result: Query = await this.client.rawQuery(GET_DECLARATION_PDF, args);

    return result.viewer?.mainAccount?.vatDeclarationPdf ?? null;
  }
}
