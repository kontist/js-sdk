import { expect } from "chai";
import { Client } from "../lib";
import * as sinon from "sinon";

describe("OAuth2 client tests", () => {
  const clientId = "26990216-e340-4f54-b5a5-df9baacc0440";
  const redirectUri = "https://localhost:3000/auth/callback";
  const scopes = ["transactions"];

  let sandbox: sinon.SinonSandbox;

  before(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(Math, "random").returns(0.25843739712322056);
  });

  after(() => {
    sandbox.restore();
  });

  describe("client with mandatory parameters", () => {
    let client: Client;

    before(() => {
      client = new Client({
        clientId,
        redirectUri,
        scopes
      });
    });

    it("should be able to create a client", () => {
      expect(client).to.exist;
    });

    describe("client.getAuthUri()", () => {
      it("should return proper redirect url", async () => {
        const url = await client.getAuthUri();
        const expectedUrl = `https://api.kontist.com/api/oauth/authorize?client_id=${clientId}&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scope=transactions&response_type=code&state=25843739712322056`;
        expect(url).to.equal(expectedUrl);
      });

      it("should return proper redirect url when codeChallenge and codeChallengeMethod are provided", async () => {
        const codeChallenge = "xc3uY4-XMuobNWXzzfEqbYx3rUYBH69_zu4EFQIJH8w";
        const codeChallengeMethod = "S256";
        const url = await client.getAuthUri({
          codeChallenge,
          codeChallengeMethod
        });
        const expectedUrl = `https://api.kontist.com/api/oauth/authorize?client_id=${clientId}&redirect_uri=https%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scope=transactions&response_type=code&state=25843739712322056&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;
        expect(url).to.equal(expectedUrl);
      });
    });
  });
});
