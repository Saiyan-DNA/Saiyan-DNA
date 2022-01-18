const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpack = require('webpack');

module.exports = {
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-transform-runtime']
                    }                    
                }
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 48000
        }
    },
    plugins: [
        /*new BundleAnalyzerPlugin({
            generateStatsFile: true,
            openAnalyzer: false
        }), */
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({
            'process_env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
    ]
}