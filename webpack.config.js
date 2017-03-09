#!/usr/bin/env node
/*eslint-env node*/

const path = require('path');

module.exports = {
    context: path.resolve(__dirname, '_dev'),
    entry: {
        'bootstrap': './js/bootstrap.js',
    },
    module: {
        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, '_dev/js')
                ],
                exclude: /node_modules/,
                // the loader which should be applied, it'll be resolved relative to the context
                loader: 'babel-loader',
                // options for the loader
                options: {
                    presets: ['es2015']
                },
            },
            {
                test: /\.html$/,
                include: [
                    path.resolve(__dirname, '_dev/templates')
                ],
                loader: 'jinja-loader'
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'static'),
        publicPath: '/static/',
        filename: './js/[name].js',
    },
    performance: {
        hints: 'warning', // enum
        maxAssetSize: 200000, // int (in bytes),
        maxEntrypointSize: 400000, // int (in bytes)
        assetFilter: function(assetFilename) {
        // Function predicate that provides asset filenames
            return assetFilename.endsWith('.js');
        }
    },
    // devtool: 'source-map',
    target: 'web',
    profile: true,
};
