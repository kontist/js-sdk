import { GraphQLClient } from "./client";
import {
  EmailDocument as EmailDocumentModel,
  Transaction as TransactionModel,
  UserEmailDocumentsArgs,
} from "./schema";

type EmailDocumentProps = keyof EmailDocumentModel;
type TransactionProps = keyof TransactionModel;

const DEFAULT_EMAIL_DOCUMENT_FIELDS = [
  "id",
  "filename",
  "url",
  "matchStatus",
  "documentNumber",
  "amount",
  "createdAt",
] as EmailDocumentProps[];

const FETCH_EMAIL_DOCUMENTS_QUERY = (
  fields: EmailDocumentProps[] = DEFAULT_EMAIL_DOCUMENT_FIELDS,
  matchFields?: TransactionProps[]
) => `
query emailDocuments($uploadSources: [DocumentUploadSource!], $filterByUnmatched: Boolean!) {
  viewer {
    emailDocuments(uploadSources: $uploadSources, filterByUnmatched: $filterByUnmatched) {
${fields.join("\n")}
${matchFields ? `matches {${matchFields.join("\n") }}` : ''}
    }
  }
}
`;

export class EmailDocument {
  constructor(protected client: GraphQLClient) {}

  public async fetch(
    args?: UserEmailDocumentsArgs,
    fields?: EmailDocumentProps[],
    matchFields?: TransactionProps[]
  ): Promise<EmailDocumentModel[]> {
    const result = await this.client.rawQuery(
      FETCH_EMAIL_DOCUMENTS_QUERY(fields, matchFields),
      args
    );

    return result.viewer?.emailDocuments ?? [];
  }
}
