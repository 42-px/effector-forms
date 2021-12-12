/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const webpack = require("webpack")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")


module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: path.resolve("./src/index.tsx"),
    devServer: {
        hot: true,
        host: "localhost",
        port: 8080,
        historyApiFallback: true,
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    output: {
        path: path.resolve("./dist"),
        publicPath: "/",
        filename: "js/[name].[hash].js",
        chunkFilename: "js/[id].[hash].js",
    },
    resolve: {
        extensions: [".js", ".ts", ".jsx", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: path.resolve("./index.html"),
        }),
    ],
}
