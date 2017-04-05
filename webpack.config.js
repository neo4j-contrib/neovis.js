var path = require('path');

module.exports = {
  entry: './src/neovis.js',
  output: {
    filename: 'bundle.js',
    library: 'NeoVis',
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist')
  }
};
