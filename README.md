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

## Usage

```typescript
import express from "express";
import { Client } from "@kontist/client";

const CALLBACK_PATH = "/auth/callback";
const REDIRECT_URI = "YOUR_BASE_URL" + CALLBACK_PATH;

// create a client
const client = new Client({
  clientId: "YOUR_CLIENT_ID",
  redirectUri: REDIRECT_URI,
  scopes: ["transactions"]
});

// redirect not authenticated user to Kontist form
app.get("/auth", (req, res) => {
  client.getAuthUri().then(uri => {
    res.redirect(uri);
  });
};

// get user token data
app.get(CALLBACK_PATH, (req, res) => {
  const callbackUrl = req.originalUrl;

  client.getToken(callbackUrl).then(
    tokenData => {
      /* got access token, login successful */
    },
    err => {
      /* handle error */
    }
  );
});
```
