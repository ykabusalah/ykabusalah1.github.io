const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    name: 'client',
    mode: 'development',
    entry:  {
        landing: './app/assets/js/tween.js',
        forum: ['popper.js/dist/popper.js', 'bootstrap/dist/js/bootstrap.js', './app/assets/js/client.js']
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.join(__dirname, 'public'),
        publicPath: '/',
    },
    resolve: {
        modules: ['node_modules', path.resolve('.')], //helps with absolute path resolution
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            __isBrowser__: 'true',
        }),
        // Copy couple of static assets to our static folder
        new CopyWebpackPlugin([
            {
                from: 'app/assets/images',
                to: 'images/',
            },
            {
                from: 'app/assets/fonts',
                to: 'fonts/',
            },
        ]),
    ],
};
