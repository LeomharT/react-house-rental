const { override, addDecoratorsLegacy, addWebpackModuleRule } = require('customize-cra');


//大多数情况下就是添加个新的loader->addWebpackModuleRule

module.exports = override(
    addDecoratorsLegacy(),
    addWebpackModuleRule({
        test: /\.worker\.js$/,
        use: { loader: "worker-loader" },
    })
);
