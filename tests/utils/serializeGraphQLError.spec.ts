import { expect } from "chai";

import { serializeGraphQLError } from "../../utils/serializeGraphQLError";

describe("serializeGraphQLError", () => {
  describe("#serializeGraphQLError", () => {
    it("should return first GraphQL error details", () => {
      // arrange
      const opts = {
        response: {
          errors: [
            {
              message: "m1",
              extensions: {
                status: 1,
                type: "t1",
              },
            },
          ],
        },
      };

      // act
      const errorOptions = serializeGraphQLError(opts);

      // assert
      expect(errorOptions.status).to.eql(1);
      expect(errorOptions.type).to.eql("t1");
      expect(errorOptions.message).to.eql("m1");
    });
    it("should return empty object if details are missing", () => {
      // arrange
      const opts = {};

      // act
      const errorOptions = serializeGraphQLError(opts);

      // assert
      expect(errorOptions.status).to.eql(undefined);
      expect(errorOptions).to.eql({});
    });
    it("should return message only if extensions are missing", () => {
      // arrange
      const opts = {
        response: {
          errors: [
            {
              message: "m1",
            },
          ],
        },
      };

      // act
      const errorOptions = serializeGraphQLError(opts);

      // assert
      expect(errorOptions.status).to.eql(undefined);
      expect(errorOptions.type).to.eql(undefined);
      expect(errorOptions.message).to.eql("m1");
    });
  });
});
