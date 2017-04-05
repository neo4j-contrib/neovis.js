var path = require('path');

module.exports = {
  entry: './src/neovis.js',
  output: {
    filename: 'bundle.js',
    library: 'NeoVis',
    libraryTarget: 'var',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      loader: 'url-loader',
      options: {
        limit: 10000
      }
    }
    ]
  }  
};
