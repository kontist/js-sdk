const path = require('path');

module.exports = {
  entry: './dist/index.js',
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Kontist'
  },
};