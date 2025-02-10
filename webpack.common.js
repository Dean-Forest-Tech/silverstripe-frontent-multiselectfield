const Path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const PATHS = {
  MODULES: Path.resolve('node_modules'),
  ROOT: Path.resolve(),
  DIST: Path.resolve('client/dist'),
  SRC: Path.resolve('client/src')
};

module.exports = {
    entry: {
        bundle: [
            `${PATHS.SRC}/MultiSelect.js`,
            `${PATHS.SRC}/script.js`
        ],
        bundlecss: [
            `${PATHS.SRC}/MultiSelect.scss`
        ]
    },
    output: {
        path: PATHS.DIST,
        filename: '[name].js',
        publicPath: PATHS.DIST
    },
    target: ['web', 'es5'],
    module: {
        rules: [
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: '[name].css',
                chunkFilename: '[id].css',
            }
        ),
        new ESLintPlugin({
            files: ['client/src/*.js'],
        })
    ]
};
