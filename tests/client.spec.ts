import { expect } from "chai";
import { Client } from "../lib";

describe("Client", () => {
  describe("client with mandatory parameters", () => {
    it("should be able to create a client", () => {
      const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
      const redirectUri = "https://localhost:3000/auth/callback";
      const scopes = ["transactions"];
      const state = "25843739712322056";

      const client = new Client({
        clientId,
        redirectUri,
        scopes,
        state
      });

      expect(client).to.exist;
    });

  });
});
