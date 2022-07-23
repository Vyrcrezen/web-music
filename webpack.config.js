const path = require('path');

module.exports = {
    mode: 'development',
    // mode: 'production',
    entry: {
        "fetchMusicCards": './src/frontend/fetchMusicCards.ts',
        "musicCardDeck": './src/frontend/musicDeck/deckComponent.tsx',
        "cardAttachTest": './src/frontend/attachCardTest.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/js'),
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js)$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', 'jsx']
    }
};
