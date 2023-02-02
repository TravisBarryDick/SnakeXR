const path = require("path");

module.exports = {
  entry: {
    main: "./src/index.ts",
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    https: true,
    hot: true,
    static: path.join(__dirname, "dist"),
    allowedHosts: "all",
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
      {
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
