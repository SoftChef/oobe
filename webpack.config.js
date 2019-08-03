const path = require('path')

module.exports = {
    mode: 'production',
    entry: './src/Main.js',
    output: {
        library: 'Oobe',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'index.js',
        globalObject: `this || (typeof window !== 'undefined' ? window : global)`
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
