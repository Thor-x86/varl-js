const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry   : "./lab.js",
    output  : {
        filename    : "varl.bundle.js",
        path        : path.resolve(__dirname, "./lab")
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename    : "./index.html",
            title       : "VARL Development"
        })
    ]
};