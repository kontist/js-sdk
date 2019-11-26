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
  const firstSubscriptionHandlerStub = sinon.stub();
  const secondSubscriptionHandlerStub = sinon.stub();
  let createSubscriptionClientStub: any;
  let firstSubscriptionResult: any;
  let secondSubscriptionResult: any;

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
      firstSubscriptionResult = client.graphQL.subscribe(
        subscriptionQuery,
        SubscriptionType.newTransaction,
        firstSubscriptionHandlerStub
      );
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
      expect(subscription.handler).to.equal(firstSubscriptionHandlerStub);
      expect(subscription.unsubscribe).to.be.a("function");
    });
  });

  describe("when adding a second subscription", () => {
    before(() => {
      createSubscriptionClientStub.resetHistory();

      secondSubscriptionResult = client.graphQL.subscribe(
        subscriptionQuery,
        SubscriptionType.newTransaction,
        secondSubscriptionHandlerStub
      );
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
      expect(subscription.handler).to.equal(secondSubscriptionHandlerStub);
      expect(subscription.unsubscribe).to.be.a("function");
    });
  });

  describe("when receiving new data", () => {
    it("should call the subscribed handlers", () => {
      expect(firstSubscriptionHandlerStub.callCount).to.equal(0);
      expect(secondSubscriptionHandlerStub.callCount).to.equal(0);

      const dummyData = {
        data: { [SubscriptionType.newTransaction]: "some-data" }
      };
      observableMock.triggerNext(dummyData);

      expect(firstSubscriptionHandlerStub.callCount).to.equal(1);
      const { data, error } = firstSubscriptionHandlerStub.getCall(0).args[0];
      expect(data).to.equal("some-data");
      expect(error).to.be.an("undefined");
      expect(secondSubscriptionHandlerStub.callCount).to.equal(1);
      const {
        data: secondHandlerData,
        error: secondHandlerError
      } = secondSubscriptionHandlerStub.getCall(0).args[0];
      expect(secondHandlerData).to.equal("some-data");
      expect(secondHandlerError).to.be.an("undefined");
    });
  });

  describe("when receiving an error", () => {
    it("should call the subscribed handlers", () => {
      const dummyError = new Error("Unauthorized");
      observableMock.triggerError(dummyError);

      expect(firstSubscriptionHandlerStub.callCount).to.equal(2);
      const { data, error } = firstSubscriptionHandlerStub.getCall(1).args[0];
      expect(data).to.be.a("null");
      expect(error).to.equal(dummyError);
      expect(secondSubscriptionHandlerStub.callCount).to.equal(2);
      const {
        data: secondHandlerData,
        error: secondHandlerError
      } = secondSubscriptionHandlerStub.getCall(1).args[0];
      expect(secondHandlerData).to.be.a("null");
      expect(secondHandlerError).to.equal(dummyError);
    });
  });

  describe("when unsubscribing", () => {
    before(() => {
      firstSubscriptionResult();
    });

    it("should no longer call the unsubscribed handlers", () => {
      observableMock.triggerNext({ data: { some: "data" } });

      expect(firstSubscriptionHandlerStub.callCount).to.equal(2);
      expect(secondSubscriptionHandlerStub.callCount).to.equal(3);

      observableMock.triggerError(new Error());

      expect(firstSubscriptionHandlerStub.callCount).to.equal(2);
      expect(secondSubscriptionHandlerStub.callCount).to.equal(4);
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

      secondSubscriptionResult();

      expect(Object.keys(client.graphQL["subscriptions"]).length).to.equal(0);

      expect(subscriptionClientMock.close.callCount).to.equal(1);
      expect(client.graphQL["subscriptionClient"]).to.be.a("null");

      observableMock.triggerNext({ data: { some: "data" } });
      observableMock.triggerError(new Error());

      expect(firstSubscriptionHandlerStub.callCount).to.equal(2);
      expect(secondSubscriptionHandlerStub.callCount).to.equal(4);
    });
  });
});

describe("unsubscribe", () => {
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
      client.graphQL.unsubscribe(1)();
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
      client.graphQL.unsubscribe(12344)();
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
      client.graphQL.unsubscribe(42)();
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
      client.graphQL.unsubscribe(42)();
    });
  });
});

describe("handleDisconnection", () => {
  let client: any;
  let refreshTokenStub: any;
  let subscribeStub: any;
  let firstSubscription: any;
  let secondSubscription: any;

  before(() => {
    client = createClient();
    refreshTokenStub = sinon.stub(client.auth.tokenManager, "refresh");
    subscribeStub = sinon.stub(client.graphQL, "subscribe");

    client.graphQL.subscriptionClient = "dummy-subscription-client";

    firstSubscription = {
      id: 1,
      query: `query #1`,
      type: SubscriptionType.newTransaction,
      handler: () => {}
    };
    secondSubscription = {
      id: 1,
      query: `query #1`,
      type: SubscriptionType.newTransaction,
      handler: () => {}
    };

    client.graphQL.subscriptions = {
      1: firstSubscription,
      2: secondSubscription
    };

    client.graphQL.handleDisconnection();
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

    const [
      firstQuery,
      firstType,
      firstHandler,
      firstSubscriptionId
    ] = subscribeStub.getCall(0).args;

    expect(firstQuery).to.equal(firstSubscription.query);
    expect(firstType).to.equal(firstSubscription.type);
    expect(firstHandler).to.equal(firstSubscription.handler);
    expect(firstSubscriptionId).to.equal(firstSubscription.id);

    const [
      secondQuery,
      secondType,
      secondHandler,
      secondSubscriptionId
    ] = subscribeStub.getCall(1).args;

    expect(secondQuery).to.equal(secondSubscription.query);
    expect(secondType).to.equal(secondSubscription.type);
    expect(secondHandler).to.equal(secondSubscription.handler);
    expect(secondSubscriptionId).to.equal(secondSubscription.id);
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
