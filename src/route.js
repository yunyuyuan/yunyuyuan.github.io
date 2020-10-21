function routeInfo (){
    // 去掉最后的 '/'
    let pathname = window.location.pathname.replace(/^(.+?)\/*$/, '$1');
    for (let i of routes){
        let regexp = i.path.replace(/\//g, '\\/').replace(/\\\/:(\w+)/g, '\\/(?<$1>[^/]+)');
        let matcher = pathname.match( new RegExp(`^${regexp}$`));
        if (matcher){
            return {
                params: matcher.groups||{},
                ...i
            }
        }
    }
    return {
        name: null,
        params: {},
        title: '404',
        keywords: `静态博客 ${siteConfig.owner}的个人博客 404`,
        description: `${siteConfig.owner}的个人博客-${siteConfig.corner}`
    }
}

function queryMap (){
    const search = window.location.search,
        map = {},
        matcher = search.match(/[?&]([^=]*)=([^&]*)/g);
    if (matcher) {
        for (let i of matcher) {
            let key = i.replace(/[?&]([^=]*)=([^&]*)/, '$1'),
                val = i.replace(/[?&]([^=]*)=([^&]*)/, '$2');
            if (Object.keys(map).indexOf(key) !== -1) {
                if (typeof map[key] == 'string') {
                    map[key] = [map[key], val]
                } else {
                    map[key].push(val)
                }
            } else {
                map[key] = val
            }
        }
    }
    return map
}

const siteConfig = require( '@/site-config')

const routes = [
    {
        path: '/',
        name: 'index',
        title: '主页',
        keywords: `静态博客 ${siteConfig.owner}的个人博客 主页`,
        description: `${siteConfig.owner}的个人博客-${siteConfig.corner}`
    },
    {
        path: '/article',
        name: 'article',
        title: '文章列表',
        keywords: `静态博客 ${siteConfig.owner}的个人博客 文章列表 博文`,
        description: `${siteConfig.owner}的个人博客-博客文章列表`
    },
    {
        path: '/article/:id',
        name: 'articleDetail',
        title: '文章详情',
        keywords: `静态博客 ${siteConfig.owner}的个人博客 文章详情`,
        description: `${siteConfig.owner}的个人博客-博客文章详情`
    },
    {
        path: '/record',
        name: 'record',
        title: '记录列表',
        keywords: `静态博客 ${siteConfig.owner}的个人博客 生活记录`,
        description: `${siteConfig.owner}的个人博客-个人生活记录`
    },
    {
        path: '/backend',
        name: 'backend',
        title: '后台管理',
        keywords: `静态博客 ${siteConfig.owner}的个人博客 后端管理`,
        description: `${siteConfig.owner}的个人博客-后端管理`
    },
    {
        path: '/msg-board',
        name: 'msgBoard',
        title: '留言板',
        keywords: `静态博客 ${siteConfig.owner}的个人博客 留言板`,
        description: `${siteConfig.owner}的个人博客-留言板`
    },
    {
        path: '/simple-code-simple-life',
        name: 'about',
        title: '简单代码-简单生活',
        keywords: `静态博客 ${siteConfig.owner}的个人博客 关于`,
        description: `${siteConfig.owner}的个人博客-关于`
    },
]

module.exports = {
    route: routes,
    routeInfo,
    queryMap
}
