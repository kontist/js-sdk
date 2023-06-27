import { expect } from "chai";
import * as sinon from "sinon";
import { Client } from "../../lib";
import {
  Transaction,
  TransactionCategory,
  BaseOperator,
  RequestPlatform,
  VatRate,
} from "../../lib/graphql/schema";
import {
  NEW_TRANSACTION_SUBSCRIPTION,
  getCreateSplitTransactionMutation,
  getDeleteSplitTransactionMutation,
  getUpdateSplitTransactionMutation,
  CREATE_TRANSACTION_ASSET,
  FINALIZE_TRANSACTION_ASSET,
  DELETE_TRANSACTION_ASSET,
  TRANSACTION_FIELDS,
} from "../../lib/graphql/transaction";
import { SubscriptionType } from "../../lib/graphql/types";
import {
  createClient,
  createTransaction,
  generatePaginatedResponse,
} from "../helpers";
import { Transaction as TransactionClass } from "../../lib/graphql/transaction";

describe("Transaction", () => {
  describe("iterator", () => {
    let client: Client;
    let firstTransaction: Transaction;
    let secondTransaction: Transaction;
    let thirdTransaction: Transaction;
    let stub: sinon.SinonStub;
    let fetchSpy: sinon.SinonSpy;

    beforeEach(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");
      fetchSpy = sinon.spy(client.models.transaction, "fetch");

      firstTransaction = createTransaction({
        name: "Santa Claus",
        amount: 900,
      });
      secondTransaction = createTransaction();
      thirdTransaction = createTransaction({
        name: "Willy Wonka",
        amount: 1200,
      });

      stub.onFirstCall().resolves(
        generatePaginatedResponse({
          key: "transactions",
          items: [firstTransaction, secondTransaction],
          pageInfo: { hasNextPage: true, hasPreviousPage: false },
        })
      );

      stub.onSecondCall().resolves(
        generatePaginatedResponse({
          key: "transactions",
          items: [thirdTransaction],
          pageInfo: { hasNextPage: false, hasPreviousPage: false },
        })
      );
    });

    afterEach(() => {
      stub.restore();
      fetchSpy.restore();
    });

    it("can fetch next page using the nextPage method", async () => {
      const firstPage = await client.models.transaction.fetch({
        first: 2,
      });

      expect(typeof firstPage.nextPage).to.equal("function");
      expect(firstPage.items).to.deep.equal([
        firstTransaction,
        secondTransaction,
      ]);

      expect(fetchSpy.callCount).to.equal(1);

      const secondPage = firstPage.nextPage && (await firstPage.nextPage());
      expect(secondPage?.items).to.deep.equal([thirdTransaction]);

      expect(fetchSpy.callCount).to.equal(2);
      expect(fetchSpy.lastCall.args).to.deep.eq([
        { first: 2, after: "22222" },
        TRANSACTION_FIELDS,
      ]);
    });

    it("can iterate on all user transactions using the fetchAll iterator", async () => {
      let transactions: Transaction[] = [];
      for await (const transaction of client.models.transaction.fetchAll()) {
        transactions = transactions.concat(transaction as Transaction);
      }

      expect(transactions).to.deep.equal([
        firstTransaction,
        secondTransaction,
        thirdTransaction,
      ]);
    });

    it("can fetch filtered transactions", async () => {
      stub.onFirstCall().resolves(
        generatePaginatedResponse({
          key: "transactions",
          items: [firstTransaction, thirdTransaction],
          pageInfo: { hasPreviousPage: false, hasNextPage: false },
        })
      );

      const results = await client.models.transaction.fetch({
        filter: {
          operator: BaseOperator.And,
          amount_gt: 1000,
          name_like: "SaNtA",
        },
      });

      expect(stub.callCount).to.equal(1);
      expect(stub.getCall(0).args[1]).to.deep.equal({
        filter: {
          operator: BaseOperator.And,
          amount_gt: 1000,
          name_like: "SaNtA",
        },
      });
      expect(results.items).to.deep.equal([firstTransaction, thirdTransaction]);
    });

    describe("when iterating backwards", () => {
      it("can fetch the previous page using the previousPage method", async () => {
        stub.onFirstCall().resolves(
          generatePaginatedResponse({
            key: "transactions",
            items: [secondTransaction, thirdTransaction],
            pageInfo: { hasPreviousPage: true, hasNextPage: false },
          })
        );
        stub.onSecondCall().resolves(
          generatePaginatedResponse({
            key: "transactions",
            items: [firstTransaction],
            pageInfo: { hasPreviousPage: false, hasNextPage: false },
          })
        );

        const firstPage = await client.models.transaction.fetch({
          last: 2,
        });

        expect(typeof firstPage.previousPage).to.equal("function");
        expect(firstPage.items).to.deep.equal([
          secondTransaction,
          thirdTransaction,
        ]);

        const secondPage =
          firstPage.previousPage && (await firstPage.previousPage());
        expect(secondPage?.items).to.deep.equal([firstTransaction]);
      });
    });
  });

  describe("#fetch", () => {
    let graphqlClientStub: { rawQuery: sinon.SinonStub };
    let transactionInstance: TransactionClass;
    let result: any;

    before(() => {
      graphqlClientStub = {
        rawQuery: sinon.stub(),
      };
      transactionInstance = new TransactionClass(graphqlClientStub as any);
    });

    describe("when there is no result", () => {
      before(async () => {
        graphqlClientStub.rawQuery.reset();
        graphqlClientStub.rawQuery.resolves({});
        result = await transactionInstance.fetch();
      });

      it("should return an empty result", () => {
        expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
        expect(result.items).to.eql([]);
        expect(result.pageInfo.hasNextPage).to.eql(false);
        expect(result.pageInfo.hasPreviousPage).to.eql(false);
      });
    });

    describe("when fetching with custom fields", () => {
      const customFields = `id category`;

      before(async () => {
        graphqlClientStub.rawQuery.reset();
        graphqlClientStub.rawQuery.resolves({});
        result = await transactionInstance.fetch(undefined, customFields);
      });

      it("should query with custom fields", () => {
        expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
        expect(graphqlClientStub.rawQuery.getCall(0).args[0]).to.contain(
          customFields
        );
      });
    });
  });

  describe("#fetchOne", () => {
    let graphqlClientStub: { rawQuery: sinon.SinonStub };
    let transactionInstance: TransactionClass;
    let result: any;

    before(() => {
      graphqlClientStub = {
        rawQuery: sinon.stub(),
      };
      transactionInstance = new TransactionClass(graphqlClientStub as any);
    });

    describe("when transaction is not found", () => {
      before(async () => {
        graphqlClientStub.rawQuery.reset();
        graphqlClientStub.rawQuery.resolves({
          viewer: { mainAccount: { transaction: null } },
        });
        result = await transactionInstance.fetchOne({ id: "some-id" });
      });

      it("should return null", () => {
        expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
        expect(result).to.eql(null);
      });
    });

    describe("when transaction is found", () => {
      let transaction: Transaction;

      before(async () => {
        transaction = createTransaction();
        graphqlClientStub.rawQuery.reset();
        graphqlClientStub.rawQuery.resolves({
          viewer: { mainAccount: { transaction } },
        });
        result = await transactionInstance.fetchOne({ id: transaction.id });
      });

      it("should return the fetched transaction", () => {
        expect(graphqlClientStub.rawQuery.callCount).to.equal(1);
        expect(result).to.eql(transaction);
      });
    });
  });

  describe("subscribe", () => {
    it("should call the corresponding graphQL client method to subscribe", () => {
      const client = createClient();
      const unsubscribe = () => {};
      const callback = () => {};
      const subscribeStub = sinon
        .stub(client.graphQL, "subscribe")
        .returns({ unsubscribe });

      const result = client.models.transaction.subscribe(callback);

      expect(subscribeStub.callCount).to.equal(1);
      const { query, type, onNext } = subscribeStub.getCall(0).args[0];
      expect(query).to.equal(NEW_TRANSACTION_SUBSCRIPTION);
      expect(type).to.equal(SubscriptionType.newTransaction);
      expect(onNext).to.equal(callback);
      expect(result).to.deep.equal({ unsubscribe });
    });
  });

  describe("#update", () => {
    let client: Client;
    let stub: any;

    before(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");
    });

    after(() => {
      stub.restore();
    });

    it("should call rawQuery and return updated transaction details", async () => {
      // arrange
      const transactionData = createTransaction({
        category: TransactionCategory.VatPayment,
        userSelectedBookingDate: new Date().toISOString(),
        personalNote: "Business lunch",
      });
      stub.resolves({
        updateTransaction: transactionData,
      } as any);

      // act
      const result = await client.models.transaction.update({
        id: transactionData.id,
        category: TransactionCategory.VatPayment,
        userSelectedBookingDate: new Date().toISOString(),
        personalNote: transactionData.personalNote,
        vatRate: VatRate.Vat_19,
        categoryCode: "1120",
      });

      // assert
      expect(stub.callCount).to.eq(1);
      expect(result).to.deep.eq(transactionData);
    });
  });

  describe("#createSplit", () => {
    let client: Client;
    let stub: any;

    before(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");
    });

    after(() => {
      stub.restore();
    });

    it("should call rawQuery once using proper arguments and return transaction data including split data", async () => {
      // arrange: split a TAX_PAYMENT transaction into TAX_PAYMENT and VAT_PAYMENT parts
      const transactionDataBefore = createTransaction({
        amount: -1000,
        category: TransactionCategory.TaxPayment,
        userSelectedBookingDate: new Date("2020-01-01").toISOString(),
        splits: [],
      });
      const splitData = [
        {
          id: 1,
          amount: -500,
          category: TransactionCategory.TaxPayment,
          userSelectedBookingDate: new Date("2020-01-01").toISOString(),
        },
        {
          id: 2,
          amount: -500,
          category: TransactionCategory.VatPayment,
          userSelectedBookingDate: new Date("2020-01-01").toISOString(),
        },
      ];
      const transactionDataAfter = createTransaction({
        amount: -1000,
        category: null,
        userSelectedBookingDate: null,
        splits: splitData,
      });
      stub.resolves({
        createTransactionSplits: transactionDataAfter,
      } as any);

      // act: update transaction with prepared split data
      const result = await client.models.transaction.createSplit({
        transactionId: transactionDataBefore.id,
        splits: splitData,
      });

      // assert: check for valid rawQuery number of calls and proper arguments + expected result
      expect(stub.callCount).to.eq(1);
      expect(stub.args[0][0]).to.eq(getCreateSplitTransactionMutation());
      expect(stub.args[0][1]).to.deep.eq({
        transactionId: transactionDataBefore.id,
        splits: splitData,
      });
      expect(result).to.deep.eq(transactionDataAfter);
    });
  });

  describe("#deleteSplit", () => {
    let client: Client;
    let stub: any;

    before(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");
    });

    after(() => {
      stub.restore();
    });

    it("should call rawQuery once using proper arguments and return transaction data with empty split", async () => {
      // arrange: remove splits from a transactions that was split into TAX_PAYMENT and VAT_PAYMENT parts
      const transactionDataBefore = createTransaction({
        amount: -1000,
        category: null,
        userSelectedBookingDate: null,
        splits: [
          {
            id: 1,
            amount: -500,
            category: TransactionCategory.TaxPayment,
            userSelectedBookingDate: new Date("2020-01-01").toISOString(),
          },
          {
            id: 2,
            amount: -500,
            category: TransactionCategory.VatPayment,
            userSelectedBookingDate: new Date("2020-01-01").toISOString(),
          },
        ],
      });
      const transactionDataAfter = createTransaction({
        amount: -1000,
        category: null,
        userSelectedBookingDate: null,
        splits: [],
      });
      stub.resolves({
        deleteTransactionSplits: transactionDataAfter,
      } as any);

      // act: remove splits from parent transaction
      const result = await client.models.transaction.deleteSplit({
        transactionId: transactionDataBefore.id,
      });

      // assert: check for valid rawQuery number of calls and proper arguments + expected result
      expect(stub.callCount).to.eq(1);
      expect(stub.args[0][0]).to.eq(getDeleteSplitTransactionMutation());
      expect(stub.args[0][1]).to.deep.eq({
        transactionId: transactionDataBefore.id,
      });
      expect(result).to.deep.eq(transactionDataAfter);
    });
  });

  describe("#updateSplit", () => {
    let client: Client;
    let stub: any;

    before(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");
    });

    after(() => {
      stub.restore();
    });

    it("should call rawQuery once using proper arguments and return transaction data", async () => {
      // arrange: modify splits from TAX_PAYMENT and VAT_PAYMENT to PRIVATE and VAT_19
      const splitDataBefore = [
        {
          id: 1,
          amount: -500,
          category: TransactionCategory.TaxPayment,
          userSelectedBookingDate: new Date("2020-01-01").toISOString(),
        },
        {
          id: 2,
          amount: -500,
          category: TransactionCategory.VatPayment,
          userSelectedBookingDate: new Date("2020-01-01").toISOString(),
        },
      ];
      const transactionDataBefore = createTransaction({
        amount: -1000,
        category: null,
        userSelectedBookingDate: null,
        splits: splitDataBefore,
      });
      const splitDataAfter = [
        {
          id: 1,
          amount: -500,
          category: TransactionCategory.Private,
          userSelectedBookingDate: null,
        },
        {
          id: 2,
          amount: -500,
          category: TransactionCategory.Vat_19,
          userSelectedBookingDate: null,
        },
      ];
      const transactionDataAfter = createTransaction({
        amount: -1000,
        category: null,
        userSelectedBookingDate: null,
        splits: splitDataAfter,
      });
      stub.resolves({
        updateTransactionSplits: transactionDataAfter,
      } as any);

      // act: update transaction splits with new split data
      const result = await client.models.transaction.updateSplit({
        transactionId: transactionDataBefore.id,
        splits: splitDataAfter,
      });

      // assert: check for valid rawQuery number of calls and proper arguments + expected result
      expect(stub.callCount).to.eq(1);
      expect(stub.args[0][0]).to.eq(getUpdateSplitTransactionMutation());
      expect(stub.args[0][1]).to.deep.eq({
        transactionId: transactionDataBefore.id,
        splits: splitDataAfter,
      });
      expect(result).to.deep.eq(transactionDataAfter);
    });
  });

  describe("#createTransactionAsset", () => {
    let client: Client;
    let stub: any;

    before(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");
    });

    after(() => {
      stub.restore();
    });

    it("should call rawQuery once using proper arguments and return upload parameters", async () => {
      const transaction = createTransaction({
        amount: -1000,
        category: TransactionCategory.TaxPayment,
        userSelectedBookingDate: new Date("2020-01-01").toISOString(),
      });

      const expectedResult = {
        assetId: "000000000000-0000-0000-0000-00000000",
        url: "https://httpbin.org/post",
        formData: [{ key: "key", value: "value" }],
      };

      stub.resolves({
        createTransactionAsset: expectedResult,
      } as any);

      const result = await client.models.transaction.createTransactionAsset({
        transactionId: transaction.id,
        name: "test",
        filetype: "jpg",
        uploadPlatform: RequestPlatform.NativeShare,
      });

      // assert: check for valid rawQuery number of calls and proper arguments + expected result
      expect(stub.callCount).to.eq(1);
      expect(stub.args[0][0]).to.eq(CREATE_TRANSACTION_ASSET);
      expect(stub.args[0][1]).to.deep.eq({
        transactionId: transaction.id,
        name: "test",
        filetype: "jpg",
        uploadPlatform: RequestPlatform.NativeShare,
      });
      expect(result).to.deep.eq(expectedResult);
    });
  });

  describe("#finalizeTransactionAssetUpload", () => {
    let client: Client;
    let stub: any;

    before(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");
    });

    after(() => {
      stub.restore();
    });

    it("should call rawQuery once using proper arguments and return the asset", async () => {
      const asset = {
        id: "000000000000-0000-0000-0000-00000000",
        name: "test",
        filetype: "jpg",
        thumbnail: "...",
        fullsize: "...",
      };

      stub.resolves({
        finalizeTransactionAssetUpload: asset,
      } as any);

      const result =
        await client.models.transaction.finalizeTransactionAssetUpload({
          assetId: asset.id,
        });

      // assert: check for valid rawQuery number of calls and proper arguments + expected result
      expect(stub.callCount).to.eq(1);
      expect(stub.args[0][0]).to.eq(
        FINALIZE_TRANSACTION_ASSET,
        DELETE_TRANSACTION_ASSET
      );
      expect(stub.args[0][1]).to.deep.eq({ assetId: asset.id });
      expect(result).to.deep.eq(asset);
    });
  });

  describe("#deleteTransactionAsset", () => {
    let client: Client;
    let stub: any;

    before(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");
    });

    after(() => {
      stub.restore();
    });

    it("should call rawQuery once using proper arguments and return a MutationResult", async () => {
      const assetId = "000000000000-0000-0000-0000-00000000";

      stub.resolves({
        deleteTransactionAsset: { success: true },
      } as any);

      const result = await client.models.transaction.deleteTransactionAsset({
        assetId,
      });

      // assert: check for valid rawQuery number of calls and proper arguments + expected result
      expect(stub.callCount).to.eq(1);
      expect(stub.args[0][0]).to.eq(DELETE_TRANSACTION_ASSET);
      expect(stub.args[0][1]).to.deep.eq({ assetId });
      expect(result).to.deep.eq({ success: true });
    });
  });

  describe("#search", () => {
    let client: Client;
    let fetchStub: any;

    before(() => {
      client = createClient();
      fetchStub = sinon.stub(client.models.transaction, "fetch").resolves();
    });

    after(() => {
      fetchStub.restore();
    });

    afterEach(() => {
      fetchStub.resetHistory();
    });

    describe("when user provides only text", () => {
      it("should call fetch with properly formatted filter", async () => {
        // arrange
        const userQuery = "hello world";

        // act
        await client.models.transaction.search(userQuery);

        // assert
        expect(fetchStub.callCount).to.eq(1);
        expect(fetchStub.getCall(0).args[0]).to.deep.eq({
          filter: {
            name_likeAny: ["hello", "world"],
            operator: BaseOperator.Or,
            purpose_likeAny: ["hello", "world"],
          },
          preset: undefined,
        });
      });
    });

    describe("when user provides only numbers", () => {
      it("should call fetch with properly formatted filter", async () => {
        // arrange
        const userQuery = "1234 -567 86.12 90,1";

        // act
        await client.models.transaction.search(userQuery);

        // assert
        expect(fetchStub.callCount).to.eq(1);
        expect(fetchStub.getCall(0).args[0]).to.deep.eq({
          filter: {
            amount_in: [
              123400, -123400, -56700, 56700, 8612, -8612, 9010, -9010,
            ],
            name_likeAny: ["1234", "-567", "86.12", "90,1"],
            operator: BaseOperator.Or,
            purpose_likeAny: ["1234", "-567", "86.12", "90,1"],
            conditions: [
              {
                amount_gte: 123400,
                amount_lt: 123500,
                operator: BaseOperator.And,
              },
              {
                amount_gt: -123500,
                amount_lte: -123400,
                operator: BaseOperator.And,
              },
              {
                amount_gte: 56700,
                amount_lt: 56800,
                operator: BaseOperator.And,
              },
              {
                amount_gt: -56800,
                amount_lte: -56700,
                operator: BaseOperator.And,
              },
            ],
          },
          preset: undefined,
        });
      });
    });

    describe("when user provides a mix of numbers and text", () => {
      it("should call fetch with properly formatted filter", async () => {
        // arrange
        const userQuery = "DE12345 -90,87 hello 33.91";

        // act
        await client.models.transaction.search(userQuery);

        // assert
        expect(fetchStub.callCount).to.eq(1);
        expect(fetchStub.getCall(0).args[0]).to.deep.eq({
          filter: {
            amount_in: [-9087, 9087, 3391, -3391],
            iban_likeAny: ["DE12345"],
            name_likeAny: ["DE12345", "-90,87", "hello", "33.91"],
            operator: BaseOperator.Or,
            purpose_likeAny: ["DE12345", "-90,87", "hello", "33.91"],
          },
          preset: undefined,
        });
      });
    });

    describe("when user provides terms which are not valid amount", () => {
      it("should call fetch without including amount filter", async () => {
        // arrange
        const userQuery = "1.123 -234, .10";

        // act
        await client.models.transaction.search(userQuery);

        // assert
        expect(fetchStub.callCount).to.eq(1);
        expect(fetchStub.getCall(0).args[0]).to.deep.eq({
          filter: {
            name_likeAny: ["1.123", "-234,", ".10"],
            operator: BaseOperator.Or,
            purpose_likeAny: ["1.123", "-234,", ".10"],
          },
          preset: undefined,
        });
      });
    });

    describe("when user provides terms which match IBAN format", () => {
      it("should call fetch including iban filter", async () => {
        // arrange
        const userQuery = "DE4567 E123 1234 FR12";

        // act
        await client.models.transaction.search(userQuery);

        // assert
        expect(fetchStub.callCount).to.eq(1);
        expect(fetchStub.getCall(0).args[0]).to.deep.eq({
          filter: {
            amount_in: [123400, -123400],
            iban_likeAny: ["DE4567", "FR12"],
            name_likeAny: ["DE4567", "E123", "1234", "FR12"],
            operator: BaseOperator.Or,
            purpose_likeAny: ["DE4567", "E123", "1234", "FR12"],
            conditions: [
              {
                amount_gte: 123400,
                amount_lt: 123500,
                operator: BaseOperator.And,
              },
              {
                amount_gt: -123500,
                amount_lte: -123400,
                operator: BaseOperator.And,
              },
            ],
          },
          preset: undefined,
        });
      });
    });

    describe("when user provides number above 20 millions", () => {
      it("should not include it as amount filter", async () => {
        // arrange
        const userQuery = "19999999 20000001 345678912";

        // act
        await client.models.transaction.search(userQuery);

        // assert
        expect(fetchStub.callCount).to.eq(1);
        expect(fetchStub.getCall(0).args[0]).to.deep.eq({
          filter: {
            amount_in: [1999999900, -1999999900],
            name_likeAny: ["19999999", "20000001", "345678912"],
            operator: BaseOperator.Or,
            purpose_likeAny: ["19999999", "20000001", "345678912"],
            conditions: [
              {
                amount_gte: 1999999900,
                amount_lt: 2000000000,
                operator: BaseOperator.And,
              },
              {
                amount_gt: -2000000000,
                amount_lte: -1999999900,
                operator: BaseOperator.And,
              },
            ],
          },
          preset: undefined,
        });
      });
    });

    describe("when user provides several spaces back to back", () => {
      it("should not include empty strings as filters", async () => {
        // arrange
        const userQuery = "  hello   world   ";

        // act
        await client.models.transaction.search(userQuery);

        // assert
        expect(fetchStub.callCount).to.eq(1);
        expect(fetchStub.getCall(0).args[0]).to.deep.eq({
          filter: {
            name_likeAny: ["hello", "world"],
            operator: BaseOperator.Or,
            purpose_likeAny: ["hello", "world"],
          },
          preset: undefined,
        });
      });
    });

    describe("when user provides 'assets_exist: false' filter", () => {
      describe("and input is empty", () => {
        it("should call fetch event", async () => {
          // arrange
          const filterQuery = { assets_exist: false };

          // act
          await client.models.transaction.search("", filterQuery);

          // assert
          expect(fetchStub.callCount).to.eq(1);
          expect(fetchStub.getCall(0).args[0]).to.deep.eq({
            filter: {
              assets_exist: false,
            },
            preset: undefined,
          });
        });
      });

      describe("and user provides text", () => {
        it("should call fetch event with properly formatted filter", async () => {
          // arrange
          const userQuery = "hello";
          const filterQuery = { assets_exist: false };

          // act
          await client.models.transaction.search(userQuery, filterQuery);

          // assert
          expect(fetchStub.callCount).to.eq(1);
          expect(fetchStub.getCall(0).args[0]).to.deep.eq({
            filter: {
              assets_exist: false,
              operator: "AND",
              conditions: [
                {
                  name_likeAny: ["hello"],
                  operator: "OR",
                  purpose_likeAny: ["hello"],
                },
              ],
            },
            preset: undefined,
          });
        });
      });

      describe("and user provides numbers", () => {
        it("should call fetch including assets and amount filter", async () => {
          // arrange
          const userQuery = "5";
          const filterQuery = { assets_exist: false };

          // act
          await client.models.transaction.search(userQuery, filterQuery);

          // assert
          expect(fetchStub.callCount).to.eq(1);
          expect(fetchStub.getCall(0).args[0]).to.deep.eq({
            filter: {
              assets_exist: false,
              operator: "AND",
              conditions: [
                {
                  name_likeAny: ["5"],
                  operator: "OR",
                  purpose_likeAny: ["5"],
                  amount_in: [500, -500],
                },
                {
                  amount_gte: 500,
                  amount_lt: 600,
                  operator: "AND",
                },
                {
                  amount_gt: -600,
                  amount_lte: -500,
                  operator: "AND",
                },
              ],
            },
            preset: undefined,
          });
        });
      });
    });

    describe("when user provides transaction filter preset", () => {
      const preset = { value: "MISSING_TAX_TRANSACTIONS" };

      describe("and input is empty", () => {
        it("should call fetch event", async () => {
          // arrange
          const filterQuery = undefined;

          // act
          await client.models.transaction.search("", filterQuery, preset);

          // assert
          expect(fetchStub.callCount).to.eq(1);
          expect(fetchStub.getCall(0).args[0]).to.deep.eq({
            filter: {
              name_likeAny: [],
              operator: "OR",
              purpose_likeAny: [],
            },
            preset,
          });
        });
      });
    });
  });

  describe("#fetchCSV", () => {
    let stub: any;
    let client: Client;
    const csv = "Buchungsdatum";
    ("Wertstellungsdatum");
    ("Transaktionstyp");
    ("Empfänger");
    ("Betrag");
    ("IBAN");
    ("Verwendungszweck");
    ("end_to_end_id");
    ("Buchungsstatus");
    ("Kategorie");
    ("Persönliche Notiz");
    ("2021-08-23");
    ("2021-08-23");
    ("Überweisung");
    ("-12,34");
    ("DE32110101001000000029");
    ("transaction1");
    ("test1");
    ("Gebucht");

    beforeEach(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");
    });

    afterEach(() => {
      stub.restore();
    });

    describe("when transactions are found", () => {
      beforeEach(async () => {
        stub.resolves({
          viewer: { mainAccount: { transactionsCSV: csv } },
        });
      });

      it("should return csv with transactions", async () => {
        const result = await client.models.transaction.fetchCSV({
          from: new Date(),
          to: new Date(),
        });
        expect(stub.callCount).to.equal(1);
        expect(result).to.eql(csv);
      });
    });

    describe("when no transactions are found", () => {
      beforeEach(async () => {
        stub.resolves({
          viewer: { mainAccount: { transactionsCSV: null } },
        });
      });

      it("should return empty string", async () => {
        const result = await client.models.transaction.fetchCSV({
          from: new Date(),
          to: new Date(),
        });
        expect(stub.callCount).to.equal(1);
        expect(result).to.eql("");
      });
    });
  });

  describe("#fetchFilterPresets", () => {
    let stub: any;
    let client: Client;
    const preset = { value: "MISSING_TAX_TRANSACTIONS" };

    beforeEach(() => {
      client = createClient();
      stub = sinon.stub(client.graphQL, "rawQuery");
    });

    afterEach(() => {
      stub.restore();
    });

    describe("when presets are found", () => {
      beforeEach(async () => {
        stub.resolves({
          viewer: { mainAccount: { transactionFilterPresets: [preset] } },
        });
      });

      it("should return transaction filter presets", async () => {
        const result = await client.models.transaction.fetchFilterPresets();
        expect(stub.callCount).to.equal(1);
        expect(result).to.eql([preset]);
      });
    });
  });
});
