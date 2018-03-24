const path = require('path');

module.exports = {
    devtool: 'source-map',
    entry: {
        reVue: './index.js'
    },
    watch: true,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.(js)$/,                   
                loader: 'babel-loader',                          
                exclude: /node_modules/      
            }
        ]
    }
}