import { expect } from "chai";
import * as sinon from "sinon";

import { Client } from "../../lib";
import { Document } from "../../lib/graphql/document";
import { Document as DocumentModel } from "../../lib/graphql/schema";

describe("Document", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;
  let document: Document;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
    const redirectUri = "https://localhost:3000/auth/callback";
    const state = "25843739712322056";
    const scopes = [""];

    client = new Client({
      clientId,
      redirectUri,
      scopes,
      state,
    });

    document = new Document(client.graphQL);
  });

  afterEach(() => {
    sandbox.restore();
  });

  const doc: DocumentModel = {
    id: "1",
    name: "test",
    type: "jpg",
    note: null,
    createdAt: "2021-07-01",
    url: "http://url.com",
    metadata: null,
    downloadUrl: "http://dummy_url.com",
  };

  describe("#fetch", () => {
    it("should call rawQuery and return documents array", async () => {
      // arrange
      const response = [doc];
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          documents: response,
        },
      } as any);

      // act
      const result = await document.fetch();

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(response);
    });

    describe("when called with custom set of fields", () => {
      it("should call rawQuery and return documents array", async () => {
        // arrange
        const response = [doc];
        const spyOnRawQuery = sandbox
          .stub(client.graphQL, "rawQuery")
          .resolves({
            viewer: {
              documents: response,
            },
          } as any);

        // act
        const result = await document.fetch(
          {
            categoryIds: ["abcd"],
          },
          ["id"]
        );

        // assert
        sinon.assert.calledOnce(spyOnRawQuery);
        expect(spyOnRawQuery.getCall(0).args[0]).equals(`
  query fetchDocuments ($categoryIds: [String!], $year: Int) {
    viewer {
      documents (categoryIds: $categoryIds, year: $year) {
        id
      }
    }
  }
`);
        expect(result).to.deep.eq(response);
      });
    });

    describe("when called with categoryIds and year", () => {
      it("should call rawQuery and return documents array", async () => {
        // arrange
        const response = [doc];
        const spyOnRawQuery = sandbox
          .stub(client.graphQL, "rawQuery")
          .resolves({
            viewer: {
              documents: response,
            },
          } as any);

        // act
        const result = await document.fetch(
          { categoryIds: ["abcd"], year: 2021 },
          ["id"]
        );

        // assert
        sinon.assert.calledOnce(spyOnRawQuery);
        expect(spyOnRawQuery.getCall(0).args[0]).equals(`
  query fetchDocuments ($categoryIds: [String!], $year: Int) {
    viewer {
      documents (categoryIds: $categoryIds, year: $year) {
        id
      }
    }
  }
`);
        expect(result).to.deep.eq(response);
      });
    });
  });

  describe("#update", () => {
    it("should call rawQuery and return updated document", async () => {
      const id = "1";
      const name = "newName";

      // arrange
      const response = [doc];
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        updateDocument: response,
      } as any);

      // act
      const result = await document.update({
        id,
        name,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(response);
    });

    it("should call rawQuery and return updated document with metadata", async () => {
      const id = "1";
      const name = "newName";

      // arrange
      const response = [doc];
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        updateDocument: response,
      } as any);

      // act
      const result = await document.update({
        id,
        name,
        metadata: {
          documentCategoryId: "8f534c7a-d126-45ff-9ed7-d6c528f39cb8",
        },
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(response);
    });
  });

  describe("#delete", () => {
    it("should call rawQuery and return result", async () => {
      const id = "1";

      // arrange
      const response = {
        success: true,
      };
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        deleteDocument: response,
      } as any);

      // act
      const result = await document.delete(id);

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(response.success);
    });
  });
});
