const path = require('path');

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: {
        "fetchMusicCards": './src/frontend/fetchMusicCards.ts',
        "musicCardDeck": './src/frontend/musicDeck/index.tsx'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/frontend'),
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};
