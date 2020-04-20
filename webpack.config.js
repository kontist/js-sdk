const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './dist/lib/index.js',
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Kontist'
  },
  plugins: [
    new CopyPlugin([
      { from: './lib/graphql/schema.flow.js', to: './lib/graphql/schema.flow.js'}
    ])
  ]
};