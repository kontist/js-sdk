import {GraphQLClient} from "./client";

import {
  Query,
  AccountDeclarationPdfUrlArgs,
  AccountDeclarationsArgs,
  Declaration as DeclarationModel,
  MutationSubmitDeclarationArgs,
  AccountDeclarationStatsArgs,
  DeclarationStats,
  MutationCategorizeTransactionForDeclarationArgs,
  CategorizeTransactionForDeclarationResponse,
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
          uploadedAt
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
      uploadedAt
    }
  }
`;

const GET_DECLARATION_STATS = `
  query GetDeclarationStats($period: String!, $year: Int!) {
    viewer {
      mainAccount {
        declarationStats(
          period: $period,
          year: $year
        ) {
          amount
          uncategorized {
            id
            amount
            name
            purpose
            valutaDate
            selectedBookingDate
            category
            elsterCode
            vatRate
            vatAmount
            isSplit
          }
          elsterGroups {
            amount
            elsterCode
            elsterCodeTranslation
            transactions {
              id
              amount
              name
              purpose
              valutaDate
              selectedBookingDate
              category
              elsterCode
              vatRate
              vatAmount
              isSplit
            }
          }
        }
      }
    }
  }
`;

const CATEGORIZE_TRANSACTION_MUTATION = `mutation(
  $id: ID!,
  $category: TransactionCategory,
  $elsterCode: String,
  $date: String
  $isSplit: Boolean
) {
  categorizeTransactionForDeclaration(
    id: $id,
    category: $category,
    elsterCode: $elsterCode
    date: $date
    isSplit: $isSplit
  ) {
    category
    elsterCode
    date
  }
}`;

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

  public async getStats(
    args: AccountDeclarationStatsArgs
  ): Promise<DeclarationStats | null> {
    const result: Query = await this.client.rawQuery(
      GET_DECLARATION_STATS,
      args
    );

    return result.viewer?.mainAccount?.declarationStats ?? null;
  }

  public async categorizeTransaction(
    args: MutationCategorizeTransactionForDeclarationArgs
  ): Promise<CategorizeTransactionForDeclarationResponse> {
    const result = await this.client.rawQuery(
      CATEGORIZE_TRANSACTION_MUTATION,
      args
    );

    return result.categorizeTransactionForDeclaration;
  }

  public async submit(
    args: MutationSubmitDeclarationArgs
  ): Promise<DeclarationModel> {
    const result = await this.client.rawQuery(SUBMIT_DECLARATION, args);
    return result.submitDeclaration;
  }
}
