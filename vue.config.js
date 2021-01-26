const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

const genTimeStamp = require("./src/utils/before_build");
const siteConfig = require('./src/site-config');

module.exports = {
    lintOnSave: false,
    indexPath: isDev?'index.html':'../404-temp.html',
    publicPath: isDev?'/':(siteConfig.cdn+'/dist'),
    productionSourceMap: false,
    chainWebpack: config => {
        config.module
            .rule('svg')
            .exclude.add(path.resolve('src/icons'))
            .end();

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });
        config.plugin('html')
            .tap(args => {
                args[0].owner = siteConfig.owner
                args[0].stamp = siteConfig.timeStamp
                return args
            })
        // 开发模式 server静态目录
        if (isDev) {
            config
                .plugin('copy')
                .tap(([pathConfigs]) => {
                    pathConfigs[0].from = path.resolve('./dynamic');
                    return [pathConfigs]
                })
        }
    },
    configureWebpack: {
        plugins: [
            new genTimeStamp()
        ]
    },
    devServer: {
        historyApiFallback: true
    }
};