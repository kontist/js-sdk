import { expect } from "chai";
import { KontistSDKError } from "../lib/errors";

describe("Errors", () => {
  describe("#KontistSDKError", () => {
    it("should set values from options", () => {
      // arrange
      const opts = {
        status: 1,
        type: "t1",
        message: "m1"
      };

      // act
      const e = new KontistSDKError(opts);

      // assert
      expect(e.status).to.eql(1);
      expect(e.type).to.eql("t1");
      expect(e.message).to.eql("m1");
    });
  });
});
