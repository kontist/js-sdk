import { GraphQLClient } from "./client";
import {
  EmailDocument as EmailDocumentModel,
  Query,
  Transaction as TransactionModel,
  UserEmailDocumentArgs,
  UserEmailDocumentsArgs,
} from "./schema";

type EmailDocumentProps = keyof EmailDocumentModel;
type TransactionProps = keyof TransactionModel;

const DEFAULT_EMAIL_DOCUMENTS_FIELDS = [
  "id",
  "filename",
  "url",
  "matchStatus",
  "documentNumber",
  "amount",
  "createdAt",
] as EmailDocumentProps[];

const DEFAULT_EMAIL_DOCUMENT_MATCH_FIELDS = [
  "id",
  "name",
  "iban",
  "amount",
  "description",
  "valutaDate",
  "personalNote",
  "type"
] as TransactionProps[];

const DEFAULT_EMAIL_DOCUMENT_FIELDS = ["id"] as EmailDocumentProps[];

const FETCH_EMAIL_DOCUMENTS_QUERY = (
  fields: EmailDocumentProps[] = DEFAULT_EMAIL_DOCUMENTS_FIELDS,
  matchFields?: TransactionProps[]
) => `
query emailDocuments($uploadSources: [DocumentUploadSource!], $filterByUnmatched: Boolean!) {
  viewer {
    emailDocuments(uploadSources: $uploadSources, filterByUnmatched: $filterByUnmatched) {
${fields.join("\n")}
${matchFields ? `matches {${matchFields.join("\n")}}` : ""}
    }
  }
}
`;

const FETCH_EMAIL_DOCUMENT_QUERY = (
  fields: EmailDocumentProps[] = DEFAULT_EMAIL_DOCUMENT_FIELDS,
  matchFields: TransactionProps[] = DEFAULT_EMAIL_DOCUMENT_MATCH_FIELDS
) => `
query emailDocument($id: String!) {
  viewer {
    emailDocument(id: $id) {
${fields.join("\n")}
${matchFields ? `matches {${matchFields.join("\n")}}` : ""}
    }
  }
}
`;

export class EmailDocument {
  constructor(protected client: GraphQLClient) {}

  public async fetchAll(
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

  public async fetchOne(
    args?: UserEmailDocumentArgs,
    fields?: EmailDocumentProps[],
    matchFields?: TransactionProps[]
  ) {
    const result: Query = await this.client.rawQuery(
      FETCH_EMAIL_DOCUMENT_QUERY(fields, matchFields),
      args
    );

    return result.viewer?.emailDocument;
  }
}
