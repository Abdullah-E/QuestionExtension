const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry:{
        content: './src/content.js',
    },
    output:{
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    watch: true,
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{from: 'static'}]
        })
    ]
}