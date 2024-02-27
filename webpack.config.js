const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./dist/lib/index.js",
  mode: "production",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: "Kontist",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "./lib/graphql/schema.flow.js",
          to: "./lib/graphql/schema.flow.js",
        },
      ],
    }),
  ],
  resolve: {
    fallback: {
      // SEE: https://github.com/mulesoft-labs/js-client-oauth2/issues/190
      querystring: require.resolve("querystring-es3"),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: "lib/graphql/schema.flow.js",
      }),
    ],
  },
};
