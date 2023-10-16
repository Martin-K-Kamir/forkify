
module.exports = () => {
    return {
        plugins: [
            require('postcss-preset-env')({
                features: {
                    "custom-properties": false,
                }
            }),
        ],
    };
};