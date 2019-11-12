import { expect } from "chai";
import * as sinon from "sinon";
import { GraphQLClient as GQLClient } from "graphql-request";

import { GraphQLError } from "../../lib/errors";

import { createClient } from "../helpers";

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

  describe("when an unexpected error was returned", () => {
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
