# Kontist SDK

JavaScript SDK for connecting to Kontist using OAuth2 and GraphQL.

## Installation

Add as dependency to your project:

```bash
npm install @kontist/client
```

You will need a valid client id and setup your redirect uri for authentication. You may request your client id in the API Console on https://kontist.dev/console/.

## Usage (NodeJS / TypeScript)

```typescript
import express from "express";
import { Client } from "@kontist/client";

const CALLBACK_PATH = "/auth/callback";
const REDIRECT_URI = <YOUR_BASE_URL> + CALLBACK_PATH;
const clientSecret = <YOUR_CLIENT_SECRET>;
const state = (Math.random() + "").substring(2);
const app = express();

// create a client
const client = new Client({
  clientId: "YOUR_CLIENT_ID",
  redirectUri: REDIRECT_URI,
  scopes: ["transactions"],
  clientSecret,
  state
});

// redirect not authenticated user to Kontist form
app.get("/auth", async (req, res) => {
  const uri = await client.auth.getAuthUri();
  res.redirect(uri);
});

// get user token data
app.get(CALLBACK_PATH, async (req, res) => {
  const callbackUrl = req.originalUrl;

  try {
    const token = await client.auth.fetchToken(callbackUrl);
    /* got access token, login successful */
    res.send("Successful, your token is " + token.accessToken);
  } catch (e) {
    /* handle error */
    res.send("Failed: " + JSON.stringify(e));
  }
});

app.listen(3000, function() {
  console.log("Listening on port 3000!");
});
```

You should be able to issue new accessToken by simply calling:

```typescript
await token.refresh((newToken) => { ... });
```

## Usage (Browser)

```html
<html>
  <body>
    <script src="https://cdn.kontist.com/sdk.min.js"></script>
    <script>
      // persist a random value
      sessionStorage.setItem(
        "state",
        sessionStorage.getItem("state") || (Math.random() + "").substring(2)
      );
      sessionStorage.setItem(
        "verifier",
        sessionStorage.getItem("verifier") || (Math.random() + "").substring(2)
      );

      // initialize Kontist client
      const client = new Kontist.Client({
        clientId: "<your client id>",
        redirectUri: "<your base url>",
        scopes: ["transactions"],
        state: sessionStorage.getItem("state"),
        verifier: sessionStorage.getItem("verifier")
      });

      const params = new URL(document.location).searchParams;
      const code = params.get("code");
      if (!code) {
        // page not called with "code" query parameter, let's redirect the user to the login
        client.auth.getAuthUri().then(function(url) {
          window.location = url;
        });
      } else {
        // we have a code, the client now can fetch a token
        client.auth.fetchToken(document.location.href).then(function() {
          // do a simple graphql query and output the account id
          client.graphQL
            .rawQuery(
              `{
              viewer {
                mainAccount {
                  iban
                  balance
                }
              }
            }`
            )
            .then(function(result) {
              console.log(result);
            });
        });
      }
    </script>
  </body>
</html>
```

Kontist SDK allows renewing access tokens in browser environments using this simple method:

```typescript
const token = await kontistClient.auth.refreshTokenSilently();
```

Optionally, this method accepts a number as an argument to specify after how many milliseconds the refresh request should timeout (default is 10000):

```typescript
// abort after 20 seconds
const token = await kontistClient.auth.refreshTokenSilently(20000);
```

### Password-based authentication

If you'd rather handle the authentication UI flow in your app, and when your oAuth2 client supports `grant_type: password`, you could request an access token in exchange for a user's credentials in one step:

```javascript
const client = new Kontist.Client({
  baseUrl: "https://staging-api.konto.io",
  clientId: 'YOUR_CLIENT_ID',
  scopes: ["users", "subscriptions", "transfers", "accounts"]
});

client.auth.fetchTokenFromCredentials({ username, password })
	.then((tokenData) => {
	  // do something with tokenData.accessToken
	  //
	  // or start using client to make authenticated requests
	});
```

### GraphQL queries

#### Raw

```typescript
const query = `{
  viewer {
    mainAccount {
      id
    }
  }
}`;

const result = await client.graphQL.rawQuery(query);
```

#### Transactions

An example to show how to fetch all user transactions

```typescript
let transactions = [];
for await (const transaction of client.models.transaction) {
  transactions = transactions.concat(transaction);
}
```

To fetch up to 50 latest transactions:

```typescript
const transactions = await client.models.transaction.fetch();
```

#### Transfers

To create and confirm a transfer / timed order / standing order:

```typescript
const confirmationId = await client.models.transfer.createOne({
  amount: <amount>,
  recipient: <recipent_name>,
  iban: <recipent_iban>,
  purpose: <optional_description>,
  e2eId: <optional_e2eId>,
  executeAt: <optional_order_execution_date> // mandatory for timed and standing order
  lastExecutionDate: <optional_last_execution_date> // optional for standing order
  reoccurrence: <optional_order_reoccurrence> // mandatory for standing order
});

// wait for sms
const smsToken = ...

const result = await client.models.transfer.confirmOne(
  confirmationId,
  smsToken
);
```

To create and confirm multiple transfers (with only one confirmation):

```typescript
const confirmationId = await client.models.transfer.createMany([{
  amount: <amount>,
  recipient: <recipent_name>,
  iban: <recipent_iban>,
  purpose: <optional_description>,
  e2eId: <optional_e2eId>,
}, {
  amount: <amount>,
  recipient: <recipent_name>,
  iban: <recipent_iban>,
  purpose: <optional_description>,
  e2eId: <optional_e2eId>,
}]);

// wait for sms
const smsToken = ...

const result = await client.models.transfer.confirmMany(
  confirmationId,
  smsToken
);
```

## MFA (Multi-Factor Authentication)

Accessing Kontist banking APIs require Multi-Factor Authentication (MFA).

MFA is available once you have installed the Kontist application and paired your device in it.

The following steps are necessary to complete the MFA procedure:
1. initiate the procedure by creating a challenge (Kontist SDK exposes a method to do that)
2. click the push notification you received on your phone, it will open the Kontist application
3. login (if applicable) and confirm the MFA by clicking on the corresponding button

Kontist SDK exposes a method to initiate the MFA flow after you successfully received the initial access token:

```typescript
// fetch a regular access token
const token = await client.auth.fetchToken(callbackUrl);

try {
  // create an MFA challenge and wait for confirmation
  const confirmedToken = await client.auth.getMFAConfirmedToken();
  // once it has been verified, your `client` instance will have a confirmed access token
  // the confirmed token is also returned in case you want to store it
} catch (err) {
  // if the challenge expires, a `ChallengeExpiredError` will be thrown
  // if the challenge is denied, a `ChallengeDeniedError` will be thrown
  console.log(err);
}
```

After obtaining a confirmed auth token with this method, you will have access to all banking APIs.

If you want to cancel a pending MFA confirmation, you can call the following method:

```typescript
client.auth.cancelMFAConfirmation();
```

The Promise returned by `getMFAConfirmedToken` will then reject with a `MFAConfirmationCanceledError`.
