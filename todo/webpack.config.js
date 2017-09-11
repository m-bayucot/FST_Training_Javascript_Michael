var path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const extractSass = new ExtractTextPlugin({
    filename: "style.css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.js'], // note if using webpack 1 you'd also need a '' in the array as well
  },
  module: {
    loaders: [
      { test: /vendor\/.+\.(jsx|js)$/, loader: 'imports?jQuery=jquery,$=jquery,this=>window'},
      {
          test: /\.scss$/,
          use: extractSass.extract({
              use: [{
                  loader: "css-loader"
              }, {
                  loader: "sass-loader"
              }],
              // use style-loader in development
              fallback: "style-loader"
          })
      },
      {
        test: /\.tpl$/,
        loader: 'underscore-template-loader'
      }
    ]
  },
  plugins: [
      extractSass
  ]
}