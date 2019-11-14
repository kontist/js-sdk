import { expect } from "chai";
import * as sinon from "sinon";
import { GraphQLClient as GQLClient } from "graphql-request";
import { SubscriptionType } from "../../lib/graphql/types";

import { GraphQLError } from "../../lib/errors";

import { createClient } from "../helpers";

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
  })
});
