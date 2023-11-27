const postcssPresetEnv = require('postcss-preset-env');
const postcssPurgecss = require('@fullhuman/postcss-purgecss');

module.exports = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    const plugins = []

    plugins.push(
        postcssPresetEnv({
            stage: 0,
            features: {
                'nesting-rules': true,
                'custom-properties': false,
            },
        }),
    )

    if (isProduction) {
        plugins.push(
            postcssPurgecss({
                content: ['./src/**/*.html', './src/**/*.js', './src/**/*.jsx'],
                safelist: {
                    standard: ['html', 'body'],
                    deep: [/^:root$/],
                },
                defaultExtractor: (content) => content.match(/[\w-/:%]+(?<!:\/\/[^"'\s]*)/g) || [],
            })
        );
    }

    return {
        plugins,
    };
};