import {expect} from "chai";
import {Client} from "../lib";
import {Auth} from "../lib/auth";
import {GraphQLClient} from "../lib/graphql/client";

describe("Client", () => {
  describe("#constructor", () => {
    it("should be able to create a client with minimal parameters", () => {
      const redirectUri = "https://localhost:3000/auth/callback";
      const scopes = ["transactions"];
      const state = "25843739712322056";

      const client = new Client({
        redirectUri,
        scopes,
        state,
      });

      expect(client).to.exist;
    });
    it("should be able to create a client with all parameters", () => {
      // arrange
      const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
      const redirectUri = "https://localhost:3000/auth/callback";
      const scopes = ["transactions"];
      const state = "25843739712322056";
      const opts = {
        clientId,
        redirectUri,
        scopes,
        state,
      };
      const auth = {} as Auth;
      const graphQL = {} as GraphQLClient;
      const models = {
        transaction: {} as any,
        transfer: {} as any,
        account: {} as any,
        user: {} as any,
        card: {} as any,
        subscription: {} as any,
        changeRequest: {} as any,
        vatDeclaration: {} as any,
      };

      // act
      const client = new Client(
        opts,
        "http://localhost:3000/api/graphql",
        "ws://localhost:3000/api/graphql",
        auth,
        graphQL,
        models
      );

      // assert
      expect(client).to.exist;
    });
  });
});
