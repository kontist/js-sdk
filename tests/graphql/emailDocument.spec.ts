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

describe("Document", () => {
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

  const response: EmailDocumentModel[] = [
    {
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
      transactionMatches: [],
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
        },
      ],
    },
  ];

  afterEach(() => {
    sandbox.restore();
  });

  describe("#fetch", () => {
    it("should call rawQuery and return documents array", async () => {
      // arrange

      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          emailDocuments: response,
        },
      } as any);

      // act
      const result = await emailDocument.fetch({
        filterByUnmatched: true,
        uploadSources: [DocumentUploadSource.Email],
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(response);
    });

    describe("when called with custom set of fields", () => {
      it("should call rawQuery and return documents array", async () => {
        const spyOnRawQuery = sandbox
          .stub(client.graphQL, "rawQuery")
          .resolves({
            viewer: {
              emailDocuments: response,
            },
          } as any);

        // act
        const result = await emailDocument.fetch(
          {
            filterByUnmatched: true,
            uploadSources: [DocumentUploadSource.Email],
          },
          ["id", "filename", "url", "matchStatus"],
          ["id", "name", "iban", "amount", "description", "valutaDate", "personalNote", "type"]
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
        expect(result).to.eq(response);
      });
    });
  });
});
