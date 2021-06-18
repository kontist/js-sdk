import { GraphQLClient } from "./client";

import {
  Query,
  AccountDeclarationPdfUrlArgs,
  AccountDeclarationsArgs,
  Declaration as DeclarationModel,
  MutationSubmitDeclarationArgs,
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
  query GetDeclarationPdf ($id: Int!) {
    viewer {
      mainAccount {
        declarationPdfUrl(id: $id)
      }
    }
  }
`;

const SUBMIT_DECLARATION = `
  mutation(
    $period: String!,
    $year: Int!
  ) {
    submitUStVA(
      period: $period,
      year: $year
    ) {
      id
      amount
      period
      year
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

  public async getPdfUrl(
    args: AccountDeclarationPdfUrlArgs
  ): Promise<string | null> {
    const result: Query = await this.client.rawQuery(GET_DECLARATION_PDF, args);

    return result.viewer?.mainAccount?.declarationPdfUrl ?? null;
  }

  public async submit(
    args: MutationSubmitDeclarationArgs
  ): Promise<DeclarationModel> {
    const result = await this.client.rawQuery(SUBMIT_DECLARATION, args);
    return result.submitDeclaration;
  }
}
