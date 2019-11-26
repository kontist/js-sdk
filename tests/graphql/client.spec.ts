import { expect } from "chai";
import * as sinon from "sinon";
import { GraphQLClient as GQLClient } from "graphql-request";
import * as subscriptions from "subscriptions-transport-ws";
import * as ws from "ws";

import { SubscriptionType } from "../../lib/graphql/types";
import { GraphQLError, UserUnauthorizedError } from "../../lib/errors";
import { createClient } from "../helpers";
import { KONTIST_SUBSCRIPTION_API_BASE_URL } from "../../lib/constants";

describe("rawQuery", () => {
  describe("Error handling", () => {
    const setup = async (response: any) => {
      const stub = sinon.stub(GQLClient.prototype, "rawRequest").throws(() => {
        const error: any = new Error();
        error.response = response;
        return error;
      });

      const client = createClient();
      client.auth.tokenManager.setToken("dummy-access-token");

      let error;
      try {
        await client.graphQL.rawQuery(``);
      } catch (err) {
        error = err;
      }

      return {
        error,
        stub
      };
    };

    describe("when a standard API error is returned", () => {
      it("should throw a GraphQLError with proper message, status and type", async () => {
        const message = "Some specific error message";
        const status = 400;
        const type = "http://www.iana.org/assignments/http-status-codes#400";
        const response = {
          errors: [
            {
              message,
              locations: [{ line: 1, column: 42 }],
              extensions: {
                status,
                type
              }
            }
          ]
        };

        const { error, stub } = await setup(response);

        expect(error).to.be.an.instanceof(GraphQLError);
        expect(error.message).to.equal(message);
        expect(error.status).to.equal(status);
        expect(error.type).to.equal(type);

        stub.restore();
      });
    });

    describe("when an unexpected error is returned", () => {
      it("should throw a GraphQLError with proper message", async () => {
        const message = "Generic error message";
        const response = {
          errors: [
            {
              message,
              locations: [{ line: 1, column: 42 }]
            }
          ]
        };

        const { error, stub } = await setup(response);

        expect(error).to.be.an.instanceof(GraphQLError);
        expect(error.message).to.equal(message);
        expect(error.status).to.be.undefined;
        expect(error.type).to.be.undefined;

        stub.restore();
      });
    });
  });
});

describe("subscribe", () => {
  const observableMock = {
    nextHandlers: [] as any,
    errorHandlers: [] as any,
    triggerNext(response: any) {
      this.nextHandlers.forEach((handler: any) => {
        handler(response);
      });
    },
    triggerError(err: any) {
      this.errorHandlers.forEach((handler: any) => {
        handler(err);
      });
    }
  };

  const subscribeStub = sinon
    .stub()
    .callsFake(({ next, error }: { next: any; error: any }) => {
      observableMock.nextHandlers.push(next as any);
      observableMock.errorHandlers.push(error as any);
      return {
        unsubscribe: () => {
          observableMock.nextHandlers = observableMock.nextHandlers.filter(
            (handler: any) => handler !== next
          );
          observableMock.errorHandlers = observableMock.errorHandlers.filter(
            (handler: any) => handler !== error
          );
        }
      };
    });
  const subscriptionClientMock = {
    onDisconnected: sinon.spy(),
    close: sinon.spy(),
    request: () => ({
      subscribe: subscribeStub
    })
  };
  const subscriptionQuery = `subscription someSubscription {}`;
  const client = createClient();
  const firstSubscriptionOnNextStub = sinon.stub();
  const secondSubscriptionOnNextStub = sinon.stub();
  const firstSubscriptionOnErrorStub = sinon.stub();
  const secondSubscriptionOnErrorStub = sinon.stub();
  let createSubscriptionClientStub: any;
  let firstSubscriptionUnsubscriber: any;
  let secondSubscriptionUnsubscriber: any;

  before(() => {
    createSubscriptionClientStub = sinon
      .stub(client.graphQL as any, "createSubscriptionClient")
      .returns(subscriptionClientMock);
  });

  after(() => {
    createSubscriptionClientStub.restore();
  });

  describe("when adding the first subscription", () => {
    before(() => {
      const { unsubscribe } = client.graphQL.subscribe({
        query: subscriptionQuery,
        type: SubscriptionType.newTransaction,
        onNext: firstSubscriptionOnNextStub,
        onError: firstSubscriptionOnErrorStub
      });
      firstSubscriptionUnsubscriber = unsubscribe;
    });

    it("should create a subscription client", () => {
      expect(createSubscriptionClientStub.callCount).to.equal(1);
    });

    it("should setup a disconnection handler", () => {
      expect(subscriptionClientMock.onDisconnected.callCount).to.equal(1);
      expect(subscriptionClientMock.onDisconnected.getCall(0).args[0]).to.equal(
        client.graphQL["handleDisconnection"]
      );
    });

    it("should add a subscription to its state", () => {
      const subscription = client.graphQL["subscriptions"][1];
      expect(subscription.id).to.equal(1);
      expect(subscription.query).to.equal(subscriptionQuery);
      expect(subscription.type).to.equal(SubscriptionType.newTransaction);
      expect(subscription.onNext).to.equal(firstSubscriptionOnNextStub);
      expect(subscription.onError).to.equal(firstSubscriptionOnErrorStub);
      expect(subscription.unsubscribe).to.be.a("function");
    });
  });

  describe("when adding a second subscription", () => {
    before(() => {
      createSubscriptionClientStub.resetHistory();

      const { unsubscribe } = client.graphQL.subscribe({
        query: subscriptionQuery,
        type: SubscriptionType.newTransaction,
        onNext: secondSubscriptionOnNextStub,
        onError: secondSubscriptionOnErrorStub
      });
      secondSubscriptionUnsubscriber = unsubscribe;
    });

    it("should NOT create a subscription client", () => {
      expect(createSubscriptionClientStub.callCount).to.equal(0);
    });

    it("should add a second subscription to its state", () => {
      const subscription = client.graphQL["subscriptions"][2];
      expect(Object.keys(client.graphQL["subscriptions"]).length).to.equal(2);
      expect(subscription.id).to.equal(2);
      expect(subscription.query).to.equal(subscriptionQuery);
      expect(subscription.type).to.equal(SubscriptionType.newTransaction);
      expect(subscription.onNext).to.equal(secondSubscriptionOnNextStub);
      expect(subscription.onError).to.equal(secondSubscriptionOnErrorStub);
      expect(subscription.unsubscribe).to.be.a("function");
    });
  });

  describe("when receiving new data", () => {
    it("should call the subscribed onNext handlers", () => {
      expect(firstSubscriptionOnNextStub.callCount).to.equal(0);
      expect(secondSubscriptionOnNextStub.callCount).to.equal(0);

      const dummyData = {
        data: { [SubscriptionType.newTransaction]: "some-data" }
      };
      observableMock.triggerNext(dummyData);

      expect(firstSubscriptionOnNextStub.callCount).to.equal(1);
      const data = firstSubscriptionOnNextStub.getCall(0).args[0];
      expect(data).to.equal("some-data");
      expect(secondSubscriptionOnNextStub.callCount).to.equal(1);
      const secondOnNextData = secondSubscriptionOnNextStub.getCall(0).args[0];
      expect(secondOnNextData).to.equal("some-data");

      expect(firstSubscriptionOnErrorStub.callCount).to.equal(0);
      expect(secondSubscriptionOnErrorStub.callCount).to.equal(0);
    });
  });

  describe("when receiving an error", () => {
    it("should call the subscribed onError handlers", () => {
      const dummyError = new Error("Unauthorized");
      observableMock.triggerError(dummyError);

      expect(firstSubscriptionOnErrorStub.callCount).to.equal(1);
      expect(secondSubscriptionOnErrorStub.callCount).to.equal(1);
      const error = firstSubscriptionOnErrorStub.getCall(0).args[0];
      expect(error).to.equal(dummyError);
      const secondError = secondSubscriptionOnErrorStub.getCall(0).args[0];
      expect(secondError).to.equal(dummyError);

      expect(firstSubscriptionOnNextStub.callCount).to.equal(1);
      expect(secondSubscriptionOnNextStub.callCount).to.equal(1);
    });
  });

  describe("when unsubscribing", () => {
    before(() => {
      firstSubscriptionUnsubscriber();
    });

    it("should no longer call the unsubscribed handlers", () => {
      observableMock.triggerNext({ data: { some: "data" } });

      expect(firstSubscriptionOnNextStub.callCount).to.equal(1);
      expect(secondSubscriptionOnNextStub.callCount).to.equal(2);

      observableMock.triggerError(new Error());

      expect(firstSubscriptionOnErrorStub.callCount).to.equal(1);
      expect(secondSubscriptionOnErrorStub.callCount).to.equal(2);
    });

    it("should remove the corresponding subscription from its state", () => {
      const subscriptions = client.graphQL["subscriptions"];
      expect(Object.keys(subscriptions).length).to.equal(1);

      expect(subscriptions[1]).to.be.a("undefined");
      expect(subscriptions[2]).to.exist;
    });
  });

  describe("when the last subscription is unsubscribed", () => {
    it("should close the websocket and remove the subscription client", () => {
      expect(subscriptionClientMock.close.callCount).to.equal(0);

      secondSubscriptionUnsubscriber();

      expect(Object.keys(client.graphQL["subscriptions"]).length).to.equal(0);

      expect(subscriptionClientMock.close.callCount).to.equal(1);
      expect(client.graphQL["subscriptionClient"]).to.be.a("null");

      observableMock.triggerNext({ data: { some: "data" } });
      observableMock.triggerError(new Error());

      expect(firstSubscriptionOnNextStub.callCount).to.equal(1);
      expect(secondSubscriptionOnNextStub.callCount).to.equal(2);

      expect(firstSubscriptionOnErrorStub.callCount).to.equal(1);
      expect(secondSubscriptionOnErrorStub.callCount).to.equal(2);
    });
  });
});

describe("createUnsubscriber", () => {
  let client: any;
  let firstUnsubscribeStub: any;
  let secondUnsubscribeStub: any;
  let closeStub: any;

  before(() => {
    firstUnsubscribeStub = sinon.stub();
    secondUnsubscribeStub = sinon.stub();
    closeStub = sinon.stub();

    client = createClient();

    client.graphQL.subscriptionClient = { close: closeStub };
    client.graphQL.subscriptions = {
      1: {
        unsubscribe: firstUnsubscribeStub
      },
      42: {
        unsubscribe: secondUnsubscribeStub
      }
    };
  });

  describe("when some subscriptions remain after unsubscribing", () => {
    before(() => {
      client.graphQL.createUnsubscriber(1)();
    });

    it("should call unsubscribe on the corresponding subscription and remove it from state", () => {
      expect(firstUnsubscribeStub.callCount).to.equal(1);
      expect(Object.keys(client.graphQL.subscriptions)).to.deep.equal(["42"]);
    });

    it("should not close the subscription connection nor destroy the subscription client", () => {
      expect(closeStub.callCount).to.equal(0);
      expect(client.graphQL.subscriptionClient).to.not.be.a("null");
    });
  });

  describe("when the subscriptionId does not exist", () => {
    before(() => {
      client.graphQL.createUnsubscriber(12344)();
    });

    it("should not remove any subscription", () => {
      expect(Object.keys(client.graphQL.subscriptions)).to.deep.equal(["42"]);
    });

    it("should not close the subscription connection nor destroy the subscription client", () => {
      expect(closeStub.callCount).to.equal(0);
      expect(client.graphQL.subscriptionClient).to.not.be.a("null");
    });
  });

  describe("when unsubscribing the last subscription", () => {
    before(() => {
      client.graphQL.createUnsubscriber(42)();
    });

    it("should call unsubscribe on the corresponding subscription and remove it from state", () => {
      expect(secondUnsubscribeStub.callCount).to.equal(1);
      expect(client.graphQL.subscriptions).to.deep.equal({});
    });

    it("should close the subscription connection and destroy the subscription client", () => {
      expect(closeStub.callCount).to.equal(1);
      expect(client.graphQL.subscriptionClient).to.be.a("null");
    });
  });

  describe("when the subscription client does not exist and unsubscribing the last subscription", () => {
    before(() => {
      client.graphQL.subscriptionClient = undefined;
      client.graphQL.subscriptions = {
        42: {
          unsubscribe: () => {}
        }
      };
    });

    it("should not throw any error", () => {
      client.graphQL.createUnsubscriber(42)();
    });
  });
});

describe("handleDisconnection", () => {
  let client: any;
  let refreshTokenStub: any;
  let subscribeStub: any;
  let firstSubscription: any;
  let secondSubscription: any;

  before(async () => {
    client = createClient();
    refreshTokenStub = sinon.stub(client.auth.tokenManager, "refresh");
    subscribeStub = sinon.stub(client.graphQL, "subscribe");

    client.graphQL.subscriptionClient = "dummy-subscription-client";

    firstSubscription = {
      id: 1,
      query: `query #1`,
      type: SubscriptionType.newTransaction,
      onNext: () => {},
      onError: sinon.stub()
    };
    secondSubscription = {
      id: 1,
      query: `query #1`,
      type: SubscriptionType.newTransaction,
      onNext: () => {}
    };

    client.graphQL.subscriptions = {
      1: firstSubscription,
      2: secondSubscription
    };

    await client.graphQL.handleDisconnection();
  });

  after(() => {
    refreshTokenStub.restore();
    subscribeStub.restore();
  });

  it("should refresh auth token", () => {
    expect(refreshTokenStub.callCount).to.equal(1);
  });

  it("should destroy the existing subscriptionClient", () => {
    expect(client.graphQL.subscriptionClient).to.be.a("null");
  });

  it("should call subscribe for each existing subscription", () => {
    expect(subscribeStub.callCount).to.equal(2);

    const {
      query: firstQuery,
      type: firstType,
      onNext: firstHandler,
      subscriptionId: firstSubscriptionId
    } = subscribeStub.getCall(0).args[0];

    expect(firstQuery).to.equal(firstSubscription.query);
    expect(firstType).to.equal(firstSubscription.type);
    expect(firstHandler).to.equal(firstSubscription.onNext);
    expect(firstSubscriptionId).to.equal(firstSubscription.id);

    const {
      query: secondQuery,
      type: secondType,
      onNext: secondHandler,
      subscriptionId: secondSubscriptionId
    } = subscribeStub.getCall(1).args[0];

    expect(secondQuery).to.equal(secondSubscription.query);
    expect(secondType).to.equal(secondSubscription.type);
    expect(secondHandler).to.equal(secondSubscription.onNext);
    expect(secondSubscriptionId).to.equal(secondSubscription.id);
  });

  describe("when auth token refresh fails", () => {
    before(async () => {
      refreshTokenStub.throws(new Error("some error"));

      await client.graphQL.handleDisconnection();
    });

    it("should call every subscribed onError handler", () => {
      expect(firstSubscription.onError.callCount).to.equal(1);

      const firstSubscriptionError = firstSubscription.onError.getCall(0)
        .args[0];

      expect(firstSubscriptionError.message).to.equal("some error");
    });
  });
});

describe("createSubscriptionClient", () => {
  let client: any;
  let subscriptionClientStub: any;
  let fakeSubscriptionClient: any;

  before(() => {
    client = createClient();
    fakeSubscriptionClient = {
      fake: "client"
    };
    subscriptionClientStub = sinon
      .stub(subscriptions, "SubscriptionClient")
      .returns(fakeSubscriptionClient);
  });

  after(() => {
    subscriptionClientStub.restore();
  });

  describe("when auth token is missing", () => {
    it("should throw a UserUnauthorized error", () => {
      let error;
      try {
        client.graphQL.createSubscriptionClient();
      } catch (err) {
        error = err;
      }

      expect(error).to.be.instanceof(UserUnauthorizedError);
    });
  });

  describe("when auth token is present", () => {
    before(() => {
      client.auth.tokenManager.setToken("dummy-token");
    });

    it("should create a new SubscriptionClient and return it", () => {
      const subscriptionClient = client.graphQL.createSubscriptionClient();
      expect(subscriptionClientStub.callCount).to.equal(1);
      const [endpoint, options, websocket] = subscriptionClientStub.getCall(
        0
      ).args;

      expect(endpoint).to.equal(
        `${KONTIST_SUBSCRIPTION_API_BASE_URL}/api/graphql`
      );
      expect(options.lazy).to.equal(true);
      expect(options.connectionParams).to.deep.equal({
        Authorization: "Bearer dummy-token"
      });
      expect(websocket).to.equal(ws);
      expect(subscriptionClient).to.equal(fakeSubscriptionClient);
    });

    describe("when executing in a browser environment", () => {
      before(() => {
        (global as any).window = {
          WebSocket: { fake: "websocket" }
        };
      });

      after(() => {
        (global as any).window = undefined;
      });

      it("should use the native browser WebSocket implementation", () => {
        subscriptionClientStub.resetHistory();

        client.graphQL.createSubscriptionClient();

        expect(subscriptionClientStub.callCount).to.equal(1);
        expect(subscriptionClientStub.getCall(0).args[2].fake).to.equal(
          "websocket"
        );
      });
    });
  });
});
