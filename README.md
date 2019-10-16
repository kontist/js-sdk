# Kontist SDK

JavaScript SDK for connecting to Kontist using OAuth2 and GraphQL.

## Installation

Add as dependency to your project:

```bash
npm install kontist-sdk
```

or

```bash
yarn add kontist-sdk
```

## Usage

```typescript
import { Client } from "kontist-sdk";

const client = new Client({
  clientId: "YOUR_CLIENT_ID",
  redirectUri: "YOUR_REDIRECT_URI",
  scopes: ["transactions"]
});

client.getAuthUri().then(uri => {
  /* redirect your user to this uri so he can provide his credentials */
});

// from where your `redirectUri` callback is called
// in this case we will use express handler as an example
app.get("/auth/callback", (req, res) => {
  const callbackUri = req.originalUrl;

  client.getToken(callbackUri).then(
    tokenData => {
      /* got access token */
    },
    err => {
      /* handle error */
    }
  );
});
```
