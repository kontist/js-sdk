# Kontist SDK

JavaScript SDK for connecting to Kontist using OAuth2 and GraphQL.

## Installation

Add as dependency to your project:

```bash
npm install @kontist/client
```

or

```bash
yarn add @kontist/client
```

## Usage (NodeJS / TypeScript)

```typescript
import express from "express";
import { Client } from "@kontist/client";

const CALLBACK_PATH = "/auth/callback";
const REDIRECT_URI = "YOUR_BASE_URL" + CALLBACK_PATH;
const state = (Math.random() + "").substring(2);
const verifier = (Math.random() + "").substring(2);

// create a client
const client = new Client({
  clientId: "YOUR_CLIENT_ID",
  redirectUri: REDIRECT_URI,
  scopes: ["transactions"],
  state,
  verifier
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
    const token = await client.auth.getToken(callbackUrl);
    /* got access token, login successful */
  } catch (e) {
    /* handle error */
  }
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

## Usage (Browser)

```html
<html>
  <body>
    <script src="dist/bundle.js"></script>
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
        client.auth.getToken(document.location.href).then(function() {
          // do a simple graphql query and output the account id
          client.graphQL
            .rawQuery(
              `{
                          viewer {
                              mainAccount {
                                  id
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
