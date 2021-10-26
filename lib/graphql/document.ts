import { GraphQLClient } from "./client";

import {
  Query,
  Document as DocumentModel,
  Mutation,
  MutationUpdateDocumentArgs,
} from "./schema";

const DOCUMENT_FIELDS = `
id
name
url
note
createdAt
`;

const FETCH_DOCUMENTS = `
  query {
    viewer {
      documents {
        ${DOCUMENT_FIELDS}
      }
    }
  }
`;

const UPDATE_DOCUMENT = `
  mutation(
    $id: ID!,
    $name: String
  ) {
    updateDocument(
      id: $id,
      name: $name
    ) {
      ${DOCUMENT_FIELDS}
    }
  }
`;

export class Document {
  constructor(protected client: GraphQLClient) {}

  public async fetch(): Promise<DocumentModel[]> {
    const result: Query = await this.client.rawQuery(FETCH_DOCUMENTS);
    return result.viewer?.documents ?? [];
  }

  public async update(
    args: MutationUpdateDocumentArgs
  ): Promise<DocumentModel> {
    const result: Mutation = await this.client.rawQuery(UPDATE_DOCUMENT, args);
    return result.updateDocument;
  }
}
