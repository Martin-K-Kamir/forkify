
module.exports = () => {
    return {
        plugins: {
            'postcss-preset-env': {
                features: {
                    'custom-properties': false,
                },
            },
            '@fullhuman/postcss-purgecss': {
                content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx'],
                safelist: {
                    standard: ['html', 'body'],
                },
                defaultExtractor: (content) => {
                    return content.match(/[\w-/:%]+(?<!:\/\/[^"'\s]*)/g) || [];
                },
            },
        },
    };
};