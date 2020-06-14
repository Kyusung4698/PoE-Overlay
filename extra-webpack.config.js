'use strict';

const webpack = require('webpack');

// https://webpack.js.org/plugins/context-replacement-plugin/
module.exports = {
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /pt-br|ru|th|de\.|fr\.|es\.|ko|zh-cn|pl/),
    ]
};