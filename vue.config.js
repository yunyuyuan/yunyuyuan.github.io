const path = require('path')

module.exports = {
    lintOnSave: false,
    configureWebpack: {
        loader: {
            test: /\.svg$/, loader: 'svg-sprite-loader', include: [path.resolve('src/assets/icons/svg')],
            options: {
                symbolId: 'icon-[name]'
            }
        }
    }
}