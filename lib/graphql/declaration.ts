import {GraphQLClient} from "./client";

import {
  Query,
  DeclarationPdf,
  AccountDeclarationPdfArgs,
  AccountDeclarationsArgs,
  Declaration as DeclarationModel,
} from "./schema";

const FETCH_DECLARATIONS = `
  query FetchDeclarations ($type: DeclarationType!) {
    viewer {
      mainAccount {
        declarations (type: $type) {
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
        declarationPdf(id: $id) {
          url
        }
      }
    }
  }
`;

export class Declaration {
  constructor(protected client: GraphQLClient) {}

  public async fetch(
    args: AccountDeclarationsArgs
  ): Promise<DeclarationModel[]> {
    const result: Query = await this.client.rawQuery(FETCH_DECLARATIONS, args);

    return result.viewer?.mainAccount?.declarations || [];
  }

  public async getPdf(
    args: AccountDeclarationPdfArgs
  ): Promise<DeclarationPdf | null> {
    const result: Query = await this.client.rawQuery(GET_DECLARATION_PDF, args);

    return result.viewer?.mainAccount?.declarationPdf ?? null;
  }
}
