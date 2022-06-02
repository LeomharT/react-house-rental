const { override, addDecoratorsLegacy, addWebpackModuleRule, adjustStyleLoaders } = require('customize-cra');


//大多数情况下就是添加个新的loader->addWebpackModuleRule

module.exports = override(
    addDecoratorsLegacy(),
    addWebpackModuleRule({
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
    }),
    //添加全局scss文件这个是可以的
    adjustStyleLoaders(rule =>
    {
        if (rule.test.toString().includes('scss')) {
            rule.use.push({
                loader: require.resolve('sass-resources-loader'),
                options: {
                    resources: [
                        './src/vvv.scss'
                    ]
                }
            });
        }
    }),
);
