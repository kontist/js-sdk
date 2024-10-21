import { expect } from "chai";
import * as sinon from "sinon";

import { Client } from "../..";
import { Declaration } from "../../graphql/declaration";
import {
  Declaration as DeclarationModel,
  DeclarationType,
  DeclarationStats,
  TransactionCategory,
  CategorizeTransactionForDeclarationResponse,
  SubmissionStatus,
  DeclarationSubmission,
  BizTaxDeclarationResultMessageType,
} from "../../graphql/schema";

describe("Declaration", () => {
  let sandbox: sinon.SinonSandbox;
  let client: Client;
  let declaration: Declaration;

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

    declaration = new Declaration(client.graphQL);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("#fetch", () => {
    it("should call rawQuery and return declarations array", async () => {
      // arrange
      const declarationsRespone: DeclarationModel[] = [
        {
          id: 1,
          amount: 5,
          period: "02",
          year: 2021,
          uploadedAt: "2021-07-01",
          submissionStatus: SubmissionStatus.AlreadySubmitted,
        },
      ];
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            declarations: declarationsRespone,
          },
        },
      } as any);

      // act
      const result = await declaration.fetch({
        type: DeclarationType.UStVa,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(declarationsRespone);
    });

    it("should call rawQuery and return empty array for missing account", async () => {
      // arrange
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      // act
      const result = await declaration.fetch({
        type: DeclarationType.UStVa,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq([]);
    });
  });

  describe("#fetchDeclarationSubmissions", () => {
    it("should call rawQuery and return declaration submissions array", async () => {
      // arrange
      const declarationSubmissionsResponse: DeclarationSubmission[] = [
        {
          id: 1,
          period: "01",
          year: 2024,
          submittedAt: "2024-01-01",
          isFinal: true,
          isSuccessful: false,
          messages: [
            {
              fieldIdentifier: "fieldIdentifier",
              formLineNumber: "11",
              text: "some error text",
              type: BizTaxDeclarationResultMessageType.Notice,
            },
          ],
        },
        {
          id: 2,
          period: "01",
          year: 2024,
          submittedAt: "2024-02-01",
          isFinal: true,
          isSuccessful: true,
          messages: [],
        },
      ];
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            vatDeclarationSubmissions: declarationSubmissionsResponse,
          },
        },
      } as any);

      // act
      const result = await declaration.fetchDeclarationSubmissions({
        year: 2024,
        period: "01",
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(declarationSubmissionsResponse);
    });

    it("should call rawQuery and return empty array for missing account", async () => {
      // arrange
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      // act
      const result = await declaration.fetch({
        type: DeclarationType.UStVa,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq([]);
    });

    it("should call rawQuery and return empty array for missing vatDeclarationSubmissions", async () => {
      // arrange
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {},
        },
      } as any);

      // act
      const result = await declaration.fetchDeclarationSubmissions({
        year: 2024,
        period: "01",
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq([]);
    });
  });

  describe("#getPdfUrl", () => {
    it("should call rawQuery and return result", async () => {
      // arrange
      const getPdfUrlRespone = "https://amazonaws.com/example.pdf";
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            declarationPdfUrl: getPdfUrlRespone,
          },
        },
      } as any);

      // act
      const result = await declaration.getPdfUrl({
        id: 1,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(getPdfUrlRespone);
    });

    it("should call rawQuery and return result for missing account", async () => {
      // arrange
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      // act
      const result = await declaration.getPdfUrl({
        id: 1,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.eq(null);
    });
  });

  describe("#getStats", () => {
    it("should call rawQuery and return declaration stats", async () => {
      // arrange
      const declarationStatsRespone: DeclarationStats[] = [
        {
          amount: 5,
          uncategorized: [
            {
              amount: 3,
              category: null,
              categoryCode: null,
              id: "4",
              name: "name",
              purpose: "",
              selectedBookingDate: null,
              valutaDate: "2021-01-01",
              vatAmount: null,
              vatRate: null,
              isSplit: false,
            },
          ],
          categoryGroups: [
            {
              amount: 0,
              categoryCode: "01",
              categoryCodeTranslation: "Private",
              transactions: [
                {
                  id: "1",
                  amount: 2,
                  category: TransactionCategory.Private,
                  categoryCode: null,
                  name: "name",
                  purpose: null,
                  selectedBookingDate: null,
                  valutaDate: "2021-01-01",
                  vatAmount: 0,
                  vatRate: "5",
                  isSplit: false,
                },
              ],
            },
          ],
          exitedBusinessAssetsWithVat: [],
        },
      ];
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {
          mainAccount: {
            declarationStats: declarationStatsRespone,
          },
        },
      } as any);

      // act
      const result = await declaration.getStats({
        year: 2021,
        period: "01",
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(declarationStatsRespone);
    });

    it("should call rawQuery and return empty array for missing account", async () => {
      // arrange
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        viewer: {},
      } as any);

      // act
      const result = await declaration.getStats({
        year: 2021,
        period: "01",
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(null);
    });
  });

  describe("#submit", () => {
    it("should call rawQuery and return declarations array", async () => {
      const period = "02";
      const year = 2021;

      // arrange
      const response: DeclarationModel = {
        id: 1,
        amount: 5,
        period,
        year,
        uploadedAt: "2021-07-01",
      };
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        submitDeclaration: response,
      } as any);

      // act
      const result = await declaration.submit({
        period,
        year,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(response);
    });
  });

  describe("#categorizeTransaction", () => {
    it("should call rawQuery and return categorization response", async () => {
      const id = "1";
      const categoryCode = "17";
      const category = TransactionCategory.TaxPayment;
      const date = new Date().toISOString();
      const isSplit = true;

      // arrange
      const response: CategorizeTransactionForDeclarationResponse = {
        categoryCode,
        category,
        date,
      };
      const spyOnRawQuery = sandbox.stub(client.graphQL, "rawQuery").resolves({
        categorizeTransactionForDeclaration: response,
      } as any);

      // act
      const result = await declaration.categorizeTransaction({
        id,
        categoryCode,
        category,
        date,
        isSplit,
      });

      // assert
      sinon.assert.calledOnce(spyOnRawQuery);
      expect(result).to.deep.eq(response);
    });
  });
});
