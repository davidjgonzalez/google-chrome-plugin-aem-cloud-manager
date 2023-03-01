const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    popup: "./src/popup/popup.js",
    content: "./src/content.js",
    background: "./src/background.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "popup.html",
      template: "src/popup/popup.html",
      chunks: ["popup"],
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/manifest.json", to: "manifest.json" },
        { from: "src/icon.png", to: "icon128.png" },
      ],
    }),
    new CopyPlugin({
        patterns: [
          { from: "src/manifest.json", to: "manifest.json" },
          { from: "src/icon.png", to: "icon128.png" },
          { from: "node_modules/@spectrum-css/icon/dist/spectrum-css-icons-medium.svg", to: "spectrum-css-icons-medium.svg"} 
        ],
      }),
  ],
};
