async function exec(args) {

    // show help and exit
    if (args[0] === "--help") {
        return showHelp();
    }

    // create client and login with password grant type
    const { Client } = require("../dist/index");
    const client = new Client({
        baseUrl: process.env.KONTIST_BASE_URL || "https://api.kontist.com",
        clientId: process.env.KONTIST_CLIENT_ID,
        clientSecret: process.env.KONTIST_CLIENT_SECRET,
        scopes: (process.env.KONTIST_CLIENT_SCOPES || "accounts").split(","),
    });
    const token = await client.auth.tokenManager.fetchTokenFromCredentials({
        username: process.env.KONTIST_USERNAME,
        password: process.env.KONTIST_PASSWORD,
    });

    // send token to stdout
    console.log(token.accessToken);
};

function showHelp() {
    console.log(`
Returns a new access token.

Usage:
  kontist token [--help]

Options:
  --help        Show this help.

Please provide this environment variables (or put them into a .env file):
  KONTIST_BASE_URL (optional, defaults to https://api.kontist.com)
  KONTIST_CLIENT_ID
  KONTIST_CLIENT_SECRET
  KONTIST_CLIENT_SCOPES (optional, defaults to "accounts"; Use comma separated string)
  KONTIST_USERNAME
  KONTIST_PASSWORD

The client needs to have the "password" grant type enabled.
    `);
}

module.exports = { exec };
