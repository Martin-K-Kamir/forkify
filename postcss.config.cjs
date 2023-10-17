
module.exports = () => {
    const isProduction = process.env.NODE_ENV === 'production';

    const plugins = {
        'postcss-preset-env': {
            features: {
                'custom-properties': false,
            },
        },
    };

    if(isProduction) {
        plugins['@fullhuman/postcss-purgecss'] = {
            content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx'],
            safelist: {
                standard: ['html', 'body'],
            },
            defaultExtractor: (content) => {
                return content.match(/[\w-/:%]+(?<!:\/\/[^"'\s]*)/g) || [];
            },
        };
    }

    return {
        plugins,
    };
};