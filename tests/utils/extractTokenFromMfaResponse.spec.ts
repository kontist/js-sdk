import { expect } from "chai";
import { extractTokensFromMfaResponse } from "../../lib/utils";

describe("extractTokenFromMfaResponse", () => {
  describe("when mfa response contains a refresh token", () => {
    it("should return both access and refresh token from response", () => {
      const mfaResponse = {
        token: "some-access-token",
        refresh_token: "some-refresh-token"
      };

      const existingToken = {
        accessToken: "some-other-access-token",
        refreshToken: "some-other-refresh-token"
      };

      const result = extractTokensFromMfaResponse(
        mfaResponse,
        existingToken as any
      );

      expect(result).to.deep.equal({
        accessToken: mfaResponse.token,
        refreshToken: mfaResponse.refresh_token
      });
    });
  });

  describe("when response does not contain a refresh token but existing token does", () => {
    it("should return access token from response and refresh token from existing token", () => {
      const mfaResponse = {
        token: "some-access-token"
      };

      const existingToken = {
        accessToken: "some-other-access-token",
        refreshToken: "some-other-refresh-token"
      };

      const result = extractTokensFromMfaResponse(
        mfaResponse,
        existingToken as any
      );

      expect(result).to.deep.equal({
        accessToken: mfaResponse.token,
        refreshToken: existingToken.refreshToken
      });
    });
  });

  describe("when neither response nor existing token contains a refresh token", () => {
    it("should return only access token from response", () => {
      const mfaResponse = {
        token: "some-access-token"
      };

      const existingToken = {
        accessToken: "some-other-access-token"
      };

      const result = extractTokensFromMfaResponse(
        mfaResponse,
        existingToken as any
      );

      expect(result).to.deep.equal({
        accessToken: mfaResponse.token,
        refreshToken: undefined
      });
    });
  });
});
