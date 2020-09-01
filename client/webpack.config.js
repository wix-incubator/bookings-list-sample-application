const path = require('path');
const {StylableWebpackPlugin} = require('@stylable/webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: isDevelopment ? 'development' : 'production',
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
            },
            {
                test: /\.tsx?$/,
                include: path.join(__dirname, 'src'),
                use: [
                    isDevelopment && {loader: 'babel-loader', options: {plugins: ['react-refresh/babel']}},
                    'awesome-typescript-loader'
                ].filter(Boolean)
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                include: [
                    path.join(__dirname, 'node_modules/wix-animations'),
                    path.join(__dirname, 'node_modules/wix-style-react')
                    // path.join(__dirname, 'node_modules/bootstrap-sass')
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
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.mjs', '.js', '.json', '.jsx']
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.USE_MOCKS': JSON.stringify(process.env.USE_MOCKS)
        }),
        new Dotenv(),
        new StylableWebpackPlugin(),
        new HtmlWebpackPlugin({title: 'Bookings List'}),
        isDevelopment && new ReactRefreshWebpackPlugin()
    ].filter(Boolean)
};
