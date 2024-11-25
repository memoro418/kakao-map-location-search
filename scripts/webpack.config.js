const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');
dotenv.config(); // .env 파일을 파싱하여 process.env로 접근 가능

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash:8].[ext]',
    clean: true,
  },
  devtool: isProd ?  false : 'eval-source-map',
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    client: {
      overlay: true,
      progress: true,
    },
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            },
          },
          {
            test: /\.css$/i,
            use: [
              isProd ? MiniCssExtractPlugin.loader: 'style-loader',
              'css-loader',
            ],
          },
          // {
          //   test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          //   type: 'asset',
          //   parser: {
          //     dataUrlCondition: {
          //       maxSize: 10000,
          //     },
          //   },
          // },
          // {
          //   type: 'asset/resource',
          //   exclude: [/\.(js|jsx)$/, /\.html$/, /\.json$/, /^$/],
          // },
        ],
      },
    ],
  },
  plugins: [isProd ? new HtmlWebpackPlugin({
        template: 'public/index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        }
      }) :
      new HtmlWebpackPlugin({ template: 'public/index.html' } ),
    isProd ? new MiniCssExtractPlugin() : undefined,
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ].filter(Boolean)
};
