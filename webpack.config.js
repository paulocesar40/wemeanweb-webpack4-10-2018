// webpack 4
//const autoprefixer = require('autoprefixer');
//const PostCssHexrgba = require('postcss-hexrgba');
const webpack = require('webpack');
const path = require('path');
//const postcss = require('postcss');
//const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');


module.exports = {
  entry: { 
    main: [
      'font-awesome/scss/font-awesome.scss',
      './src/index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src','source:srcset']
            //attrs: [':data-src']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader', MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use:'url-loader?limit=10000&name=fonts/[name].[ext]'
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        exclude: [/images/],
        use: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'images/',
              publicPath: 'images/'
            }
          }
        ]
      },
      {
        test: /font-awesome\.config\.js/,
        use: [
          { loader: 'style-loader' },
          { loader: 'font-awesome-loader' }
        ]
      }
    ]
  },
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    open: false
    //port: 3000
  },
  plugins: [
    // new ExtractTextPlugin(
    //   {filename: 'style.[hash].css', disable: false, allChunks: true}
    // ),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
    new CleanWebpackPlugin('dist', {}),
    //new MiniCssExtractPlugin({
    //  filename: 'style.[hash].css'
    //}),
    new HtmlWebpackPlugin({
      inject: true,
      title: 'We Mean Web',
      hash: true,
      template: './src/index.html',
      filename: 'index.html'
    }),
    new WebpackMd5Hash(),
    new webpack.HotModuleReplacementPlugin(),
    new BrowserSyncPlugin(
      // BroserSync options
      {
        // browse to http://localhost:3000/ during development
        host: 'localhost',
        notify: false,
        port: 3000,
        // proxy the Webpack Dev Server endpoint
        // (wich should be serving on http://localhost:8080)
        // througn BrowserSync
        proxy: 'http://localhost:8080/',
        files: [{
          match: [
            '**/*.html'
          ],
          fn: function(event, file) {
            if (event === "change") {
              const bs = require('browser-sync').get('bs-webpack-plugin');
              bs.reload();
            }
          }
        }]
      },
        // plugin options
      {
        // prevent BrowserSync from reloading the page
        // and let Webpack Dev Server take care of this
        reload: true
      }
    )
  ]
};