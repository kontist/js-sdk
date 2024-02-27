import { GraphQLClient } from "./client";

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

const DECLARATION_FIELDS = `
  id
  amount
  period
  year
  uploadedAt
  submissionStatus
`;

const FETCH_DECLARATIONS = `
  query fetchDeclarations ($type: DeclarationType!) {
    viewer {
      mainAccount {
        declarations (type: $type) {
          ${DECLARATION_FIELDS}
        }
      }
    }
  }
`;

const GET_DECLARATION_PDF = `
  query getDeclarationPdf ($id: Int!) {
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
    submitDeclaration(
      period: $period,
      year: $year
    ) {
      ${DECLARATION_FIELDS}
    }
  }
`;

const GET_DECLARATION_STATS = `
  query getDeclarationStats($period: String!, $year: Int!) {
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
            categoryCode
            vatCategoryCode
            vatRate
            vatAmount
            isSplit
          }
          categoryGroups {
            amount
            categoryCode
            categoryCodeTranslation
            transactions {
              id
              amount
              name
              purpose
              valutaDate
              selectedBookingDate
              category
              categoryCode
              vatCategoryCode
              vatRate
              vatAmount
              isSplit
            }
          }
          exitedBusinessAssetsWithVat {
            id
            exitAmount
            exitDate
            assetClass
            assetType
          }
        }
      }
    }
  }
`;

const CATEGORIZE_TRANSACTION_MUTATION = `mutation(
  $id: ID!,
  $category: TransactionCategory,
  $categoryCode: String,
  $vatCategoryCode: String,
  $date: String
  $isSplit: Boolean
  $businessAssetInput: BusinessAssetInput
) {
  categorizeTransactionForDeclaration(
    id: $id,
    category: $category,
    categoryCode: $categoryCode
    vatCategoryCode: $vatCategoryCode,
    date: $date
    isSplit: $isSplit
    businessAssetInput: $businessAssetInput
  ) {
    category
    categoryCode
    vatCategoryCode
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
