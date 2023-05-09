const path = require('path');

module.exports = {
    entry: './src/neovis.ts',
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: process.env.BUILD_WITH_DEPENDENCIES ? 'neovis.js' : 'neovis-without-dependencies.js',
        library: 'NeoVis',
        libraryTarget: 'umd',
        sourceMapFilename: '[name].map[hash]',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [{
            test: /\.ts$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.(png|jpg|gif|svg|eot|ttf|woff2?)$/,
            type: "asset"
        }]
    },
    externals: [
        // externalize any library used
        ({context, request}, callback) => {
            if(!process.env.BUILD_WITH_DEPENDENCIES && !/^[\\.\/]/.test(request)) {
                return callback(null, {
                    commonjs: request,
                    commonjs2: request,
                    amd: request
                })
            }
            callback();
        }
    ]
};
