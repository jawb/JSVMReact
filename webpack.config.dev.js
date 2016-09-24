var webpack = require('webpack');
var path = require('path');


module.exports = {
    devtool: 'eval',
    entry: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client',
        'babel-polyfill',
        path.join(__dirname, 'JSVM/app/main.js')
    ],
    output: {
        path: path.join(__dirname, 'JSVM/public'),
        filename: 'main.js',
        publicPath: '/public/js/'
    },
    module: {
        loaders: [
            { test: /\.js?$/, loader: 'babel', exclude: /node_modules/ },
            { test: /\.less$/, loader: 'style!css!less' },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg|jpg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file" }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        alias: {
            app: __dirname + '/JSVM/app'
        }
    }
};
