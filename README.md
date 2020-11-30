# Kontist SDK

JavaScript SDK for connecting to Kontist using OAuth2 and GraphQL. Please see https://kontist.dev/sdk for a more complete documentation.

## Installation

Add as dependency to your project:

```bash
npm install kontist
```

You will need a valid client id and setup your redirect uri for authentication. You may request your client id in the API Client Management on https://kontist.dev/client-management/.

## Usage (NodeJS / TypeScript)

```typescript
import express from "express";
import { Client } from "kontist";

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
  const uri = await client.auth.tokenManager.getAuthUri();
  res.redirect(uri);
});

// get user token data
app.get(CALLBACK_PATH, async (req, res) => {
  const callbackUrl = req.originalUrl;

  try {
    const token = await client.auth.tokenManager.fetchToken(callbackUrl);
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
const token = await client.auth.tokenManager.refresh();
```

Optionally, this method accepts a number as an argument to specify after how many milliseconds the refresh request should timeout (default is 10000):

```typescript
// abort after 20 seconds
const token = await client.auth.tokenManager.refresh(20000);
```

**Note:** to create a client that can handle public request, you need to initialize `Client` without `clientId`.

```typescript
const client = new Client({
  scopes: ["transactions"],
  state
});
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
        client.auth.tokenManager.getAuthUri().then(function(url) {
          window.location = url;
        });
      } else {
        // we have a code, the client now can fetch a token
        client.auth.tokenManager.fetchToken(document.location.href).then(function() {
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
const token = await client.auth.tokenManager.refresh();
```

Optionally, this method accepts a number as an argument to specify after how many milliseconds the refresh request should timeout (default is 10000):

```typescript
// abort after 20 seconds
const token = await client.auth.tokenManager.refresh(20000);
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

An example to show how to fetch all user transactions:

```typescript
let transactions = [];
for await (const transaction of client.models.transaction.fetchAll()) {
  transactions = transactions.concat(transaction);
}
```

To fetch up to 50 latest transactions:

```typescript
const transactions = await client.models.transaction.fetch();
```

To subscribe to new transactions:

```typescript
const onNext = transaction => {
  // do something with the transaction
}

const onError = error => {
  // do something with the error
}

client.models.transaction.subscribe(onNext, onError);
```

Whenever a new transaction is created, the `onNext` function will be called.
Whenever an error occurs with the subscription, the `onError` function will be called.

The `subscribe` method returns a `Subscription` object with an `unsubscribe` method to be called when you want to unsubscribe to new transactions:

```typescript
const { unsubscribe } = client.models.transaction.subscribe(onNext, onError);
// ...
unsubscribe();
// after this point, onNext / onError will no longer be called when new transactions / errors are received
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

An example to show how to fetch all user transfers of a given type:

```typescript
let transfers = [];
for await (const transfer of client.models.transfer.fetchAll({
  type: Schema.TransferType.SepaTransfer
})) {
  transfers = transfers.concat(transfer);
}
```

To fetch up to 50 latest transfers of a given type:

```typescript
const transfers = await client.models.transfer.fetch({
  type: Schema.TransferType.TimedOrder
});
```

#### Cards

Several methods are available to create, manage and fetch cards.

Here is an example of how to create a new card for a user:

```typescript
const card = await client.models.card.create({
  type: CardType.VisaBusinessDebit
});
```

And here is how you can retrieve the details of existing cards:

```typescript
const result = await client.models.card.fetch();
```

## MFA (Multi-Factor Authentication)

Accessing Kontist banking APIs require Multi-Factor Authentication (MFA).

MFA is available once you have installed the Kontist application and paired your device in it.

The following steps are necessary to complete the MFA procedure:
1. initiate the procedure by creating a challenge (Kontist SDK exposes a method to do that)
2. click the push notification you received on your phone, it will open the Kontist application
3. login (if applicable) and confirm the MFA by clicking on the corresponding button

Kontist SDK exposes a method to initiate the push notification MFA flow after you successfully received the initial access token:

```typescript
// fetch a regular access token
const token = await client.auth.tokenManager.fetchToken(callbackUrl);

try {
  // create a push notification challenge and wait for confirmation
  const confirmedToken = await client.auth.push.getConfirmedToken();
  // once it has been verified, your `client` instance will have a confirmed access token
  // the confirmed token is also returned in case you want to store it
} catch (err) {
  // if the challenge expires, a `ChallengeExpiredError` will be thrown
  // if the challenge is denied, a `ChallengeDeniedError` will be thrown
  console.log(err);
}
```

After obtaining a confirmed auth token with this method, you will have access to all banking APIs.

If you want to cancel a pending push notification confirmation, you can call the following method:

```typescript
client.auth.push.cancelConfirmation();
```

The Promise returned by `getConfirmedToken` will then reject with a `MFAConfirmationCanceledError`.
