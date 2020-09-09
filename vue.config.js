const path = require('path')

module.exports = {
    lintOnSave: false,
    chainWebpack: config => {
        config.module
            .rule('svg')
            .exclude.add(path.resolve('src/icons'))
            .end()

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
    },
}