const path = require('path')
const ExtractCssChunks = require("extract-css-chunks-webpack-plugin")
const webpack = require('webpack')
const WebpackBuildNotifierPlugin = require('webpack-build-notifier')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MinifyPlugin = require("babel-minify-webpack-plugin")
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const devMode = process.env.NODE_ENV !== 'production'
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
    entry: {
        app: path.join(__dirname, './assets/js/app.js')
    },
    mode: devMode === 'production' ? 'production' : 'development',
    output: {
        filename: 'js/[name].js',
        path: path.join(__dirname, './dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, './'),
        inline: true,
        port: 8080,
        watchContentBase: true,
        stats: {
            colors: true
        },
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'components': path.resolve(__dirname, './components'),
            'images': path.resolve(__dirname, './assets/images')
        }
    },
    module: {
       rules: [
            {
                test: /\.html$/,
                use: [
                    'html-loader'
                ]
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.css$/,
                use: [
                  {
                    loader: ExtractCssChunks.loader
                  },
                  "css-loader"
                ]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    devMode ? 'style-loader' : ExtractCssChunks.loader,
                    'css-loader?url=false',
                    { 
                        loader:'postcss-loader',
                        options: {
                            config: {
                                path: path.resolve(__dirname, './postcss.config.js')
                            }
                        }
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                    useRelativePath: false,
                    emitFile: false //Prevents files from moving since they're correctly referenced
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            },
            {
                test: /\.svg$/,
                loader: 'vue-svg-loader',
                options: {
                    useSvgo: false, // (optional) default: true
                }
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'assets/images/', to: 'images/' },
            { from: 'assets/fonts/', to: 'fonts/' },
        ], { copyUnmodified: true }),
        new VueLoaderPlugin(),
        new ExtractCssChunks({
              filename: "css/[name].css",
              chunkFilename: "[id].css",
              publicPath: path.join(__dirname, './assets/dist'),
        }),
        new WebpackBuildNotifierPlugin({
            sound: 'Funk',
            successSound: 'Pop'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, './assets/templates/index.html'),
            inject: true,
            minify: true,
            hash: true,
            cache: true,
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackHarddiskPlugin(),
        new webpack.ProvidePlugin({
            _ : ['lodash']
        }),
        new ProgressBarPlugin()
    ],
}

if ( process.env.NODE_ENV === 'production' ) {
    config.plugins.push(
        new CleanWebpackPlugin(['dist']),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new MinifyPlugin(),
        new OptimizeCssAssetsPlugin(),
        new ProgressBarPlugin()
    )
}


module.exports = config