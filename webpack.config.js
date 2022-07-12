const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        "fetchMusicCards": './src/frontend/fetchMusicCards.ts',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/frontend'),
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
};
