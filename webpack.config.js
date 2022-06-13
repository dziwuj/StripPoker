var HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const npm_package = require("./package.json");

module.exports = {
    entry: {
        main: "./src/ts/main.ts",
        // nazwa_pliku_wynikowego_2: "./src/plik2.ts",
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "js/[name].bundle.js",
        assetModuleFilename: "assets/[name][ext]",
    },
    mode: "development",
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            filename: "index.html",
            title: "Strip poker",
            template: "./src/html/index.html",
            // chunks: ["utility"],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader",
                        options: {
                            insert: "head", // insert style tag inside of <head>
                            injectType: "singletonStyleTag", // this is for wrap all your style in just one style tag
                        },
                    },
                    "css-loader",
                ],
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                type: "asset/resource",
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024, // 8kb
                    },
                },
                // use: [
                //     {
                //         loader: "file-loader",
                //         options: {
                //             limit: 8000, // Convert images < 8kb to base64 strings
                //             name: "assets/[name].[ext]",
                //         },
                //     },
                // ],
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".jsx"],
        alias: {
            assets: path.resolve(__dirname, "./src/assets"),
        },
        // alias: npm_package._moduleAliases || {},
        // modules: npm_package._moduleDirectories || [],
    },
    // watch: true,
};
