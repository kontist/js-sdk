import { expect } from "chai";
import * as sinon from "sinon";

import { Client } from "../../lib";
import { EmailDocument } from "../../lib/graphql/emailDocument";
import {
  DocumentMatchStatus,
  DocumentUploadSource,
  EmailDocument as EmailDocumentModel,
  TransactionProjectionType,
} from "../../lib/graphql/schema";

describe("EmailDocument", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;
  let emailDocument: EmailDocument;

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

    emailDocument = new EmailDocument(client.graphQL);
  });

  const exampleEmailDocument: EmailDocumentModel = {
    id: "02384af9-5a39-4af2-8174-59125ccb1a32",
    amount: 10,
    currency: null,
    date: "2021-08-05",
    name: "Amazon",
    iban: "DE124567",
    documentNumber: "AB20205",
    createdAt: "2021-08-05",
    matchStatus: DocumentMatchStatus.TooManyMatches,
    filename: "file2.pdf",
    url: "http://url.com",
    matches: [
      {
        id: "99384af9-5a39-4af2-8174-59125ccb1a99",
        name: "Some name",
        iban: "DE505050",
        amount: 100,
        description: "Some description",
        createdAt: "2022-07-06",
        valutaDate: "2022-06-06",
        bookingDate: "2022-06-06",
        type: TransactionProjectionType.SepaCreditTransfer,
        assets: [],
        canBeRecategorized: true,
        directDebitFees: [],
        fees: [],
        paymentMethod: "",
        splits: [],
        transactionAssets: [],
        personalNote: "Some note",
      },
    ],
  };

  afterEach(() => {
    sandbox.restore();
  });

  describe("#fetchAll", () => {
    it("should call rawQuery and return documents array", async () => {
      // arrange
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          emailDocuments: [exampleEmailDocument],
        },
      } as any);

      // act
      const result = await emailDocument.fetchAll({
        filterByUnmatched: true,
        uploadSources: [DocumentUploadSource.Email],
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq([exampleEmailDocument]);
    });

    describe("when called with custom set of fields", () => {
      it("should call rawQuery and return emailDocument array", async () => {
        const spyOnRawQuery = sandbox
          .stub(client.graphQL, "rawQuery")
          .resolves({
            viewer: {
              emailDocuments: [exampleEmailDocument],
            },
          } as any);

        // act
        const result = await emailDocument.fetchAll(
          {
            filterByUnmatched: true,
            uploadSources: [DocumentUploadSource.Email],
          },
          ["id", "filename", "url", "matchStatus"],
          [
            "id",
            "name",
            "iban",
            "amount",
            "description",
            "valutaDate",
            "personalNote",
            "type",
          ]
        );

        // assert
        sinon.assert.calledOnce(spyOnRawQuery);

        expect(spyOnRawQuery.getCall(0).args[0]).equals(`
query emailDocuments($uploadSources: [DocumentUploadSource!], $filterByUnmatched: Boolean!) {
  viewer {
    emailDocuments(uploadSources: $uploadSources, filterByUnmatched: $filterByUnmatched) {
id
filename
url
matchStatus
matches {id
name
iban
amount
description
valutaDate
personalNote
type}
    }
  }
}
`);

        expect(result[0]).to.eq(exampleEmailDocument);
      });
    });

    describe("error case", () => {
      it("should fail", async () => {
        sandbox.stub(client.graphQL, "rawQuery").resolves({
          error: {
            message: "Some error message",
          },
        } as any);
        // act

        const result = await emailDocument.fetchAll();

        // assert
        expect(result).to.deep.equal([]);
      });
    });
  });

  describe("#fetchOne", () => {
    it("should call rawQuery and return email documents array", async () => {
      // arrange
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          emailDocument: exampleEmailDocument,
        },
      } as any);

      // act
      const result = await emailDocument.fetchOne({
        id: "02384af9-5a39-4af2-8174-59125ccb1a32",
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(exampleEmailDocument);
    });

    describe("when called with custom set of fields", () => {
      it("should call rawQuery and return emailDocument", async () => {
        const spyOnRawQuery = sandbox
          .stub(client.graphQL, "rawQuery")
          .resolves({
            viewer: {
              emailDocument: exampleEmailDocument,
            },
          } as any);

        // act
        const result = await emailDocument.fetchOne(
          {
            id: "02384af9-5a39-4af2-8174-59125ccb1a32",
          },
          ["id", "filename", "url", "matchStatus"],
          [
            "id",
            "name",
            "iban",
            "amount",
            "description",
            "valutaDate",
            "personalNote",
            "type",
          ]
        );

        // assert
        sinon.assert.calledOnce(spyOnRawQuery);

        expect(spyOnRawQuery.getCall(0).args[0]).equals(`
query emailDocument($id: String!) {
  viewer {
    emailDocument(id: $id) {
id
filename
url
matchStatus
matches {id
name
iban
amount
description
valutaDate
personalNote
type}
    }
  }
}
`);
        expect(result).to.equal(exampleEmailDocument);
      });
    });
  });

  describe("#matchEmailDocumentToTransaction", () => {
    it("should call rawQuery and return result", async () => {
      // arrange
      const response = {
        success: true,
      };
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        matchEmailDocumentToTransaction: response,
      } as any);

      // act
      const result = await emailDocument.matchEmailDocumentToTransaction({
        transactionId: "02384af9-5a39-4af2-8174-59125ccb1a3d",
        emailDocumentId: "12384af9-5a39-4af2-8174-59125ccb1a3d",
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
        deleteEmailDocument: response,
      } as any);

      // act
      const result = await emailDocument.delete({ id });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(response);
    });
  });
});
