const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if(isProd){
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }
    return config
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
       main: ['./index.js'],
       another: './another.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: filename('js')
    },
    resolve: {
        extensions:['.js', '.css', '.png', '.json', 'scss'],
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: false, 
        liveReload: true
    },
    plugins:[
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: isProd
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                    {
                        from: path.resolve(__dirname, 'src/assets/favicon.ico'),
                        to: path.resolve(__dirname, 'dist')
                    }
                ]           
            }           
        ),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })

    ],
    module:{
        rules:[
            {
                test: /\.s[ac]ss$/i,
                use: [
                  {
                      loader: MiniCssExtractPlugin.loader
                  },
                  "css-loader",
                  "sass-loader",
                ],
              },
              {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset/resource'
              },
            {
                test: /\.(ttf|woff|woff2|fnt)$/,
                type: 'asset/resource'
            }, 
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader",
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              }
        ]
    }
}