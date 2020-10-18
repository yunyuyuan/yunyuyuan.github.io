const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const siteConfig = require('./src/site-config');
const {route} = require("./src/route")

const pages = {};
route.forEach(e=>{
    pages[e.name] = {
      entry: 'src/index.js',
      template: 'public/index.html',
      filename: e.htmlPath
    }
})

module.exports = {
    lintOnSave: false,
    publicPath: isDev?'':(siteConfig.cdn+'/dist'),
    productionSourceMap: false,
    pages: pages,
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
};