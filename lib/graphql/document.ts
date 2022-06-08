import { GraphQLClient } from "./client";

import {
  Document as DocumentModel,
  MutationUpdateDocumentArgs,
} from "./schema";

type DocumentProps = keyof DocumentModel;

const DOCUMENT_METADATA = `
  metadata {
    category {
      categoryName
      folderName
    }
  }
`;

const DEFAULT_DOCUMENT_FIELDS = [
  "id",
  "name",
  "type",
  "url",
  "note",
  "createdAt",
  DOCUMENT_METADATA,
] as DocumentProps[];

const FETCH_DOCUMENTS_QUERY = (fields: DocumentProps[] = DEFAULT_DOCUMENT_FIELDS) => `
  query {
    viewer {
      documents {
        ${fields.join("\n")}
      }
    }
  }
`;

const UPDATE_DOCUMENT_QUERY = (fields: DocumentProps[] = DEFAULT_DOCUMENT_FIELDS) => `
  mutation(
    $id: ID!,
    $name: String
  ) {
    updateDocument(
      id: $id,
      name: $name
    ) {
      ${fields.join("\n")}
    }
  }
`;

const DELETE_DOCUMENT_QUERY = `
  mutation($id: ID!) {
    deleteDocument(id: $id) {
      success
    }
  }
`;

export class Document {
  constructor(protected client: GraphQLClient) {}

  public async fetch(fields?: DocumentProps[]): Promise<DocumentModel[]> {
    const result = await this.client.rawQuery(
      FETCH_DOCUMENTS_QUERY(fields)
    );
    return result.viewer?.documents ?? [];
  }

  public async update(
    args: MutationUpdateDocumentArgs,
    fields?: DocumentProps[]
  ): Promise<DocumentModel> {
    const result = await this.client.rawQuery(
      UPDATE_DOCUMENT_QUERY(fields),
      args
    );
    return result.updateDocument;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.client.rawQuery(DELETE_DOCUMENT_QUERY, { id });
    return result.deleteDocument.success;
  }
}
