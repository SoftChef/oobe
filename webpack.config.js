const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/Main.js',
    output: {
        library: 'oobe',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'index.js',
        globalObject: 'this'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        compact: false
                    }
                }
            }
        ]
    }
}
