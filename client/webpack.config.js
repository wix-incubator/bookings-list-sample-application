const path = require('path');
const { StylableWebpackPlugin } = require('@stylable/webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader',
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
            },
            {
                test: /\.scss$/,
                include: [
                    path.join(__dirname, 'node_modules/wix-animations'),
                    path.join(__dirname, 'node_modules/wix-style-react'),
                    path.join(__dirname, 'node_modules/bootstrap-sass')
                ],
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            localsConvention: 'camelCase',
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            }
                        }
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.mjs', '.js', '.json'],
    },
    plugins: [new StylableWebpackPlugin(), new HtmlWebpackPlugin({ title: 'Stylable App' })],
};
