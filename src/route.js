function routeInfo (){
    // 去掉最后的 '/'
    const pathname = window.location.pathname.replace(/^(.+?)\/*$/, '$1');
    for (const i of routes){
        const paramNames = [];
        const regexp = i.path.replace(/\/:(\w+)/g, (a, b)=>{
            paramNames.push(b);
            return '/([^/]+)'
        });
        const matcher = pathname.match( new RegExp(`^${regexp}$`));
        if (matcher){
            const params = {};
            for (let idx=1;idx<=paramNames.length;idx++){
                params[paramNames[idx-1]] = matcher[idx];
            }
            return {
                params: params||{},
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
        for (const i of matcher) {
            const key = i.replace(/[?&]([^=]*)=([^&]*)/, '$1'),
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
        name: 'home',
        title: siteConfig.homeTitle,
        comp: ()=>import('@/views/home/index'),
        keywords: `静态博客 ${siteConfig.owner}的个人博客 主页`,
        description: `${siteConfig.owner}的个人博客-${siteConfig.corner}`
    },
    {
        path: '/article',
        name: 'article',
        title: '文章列表',
        comp: ()=>import('@/views/article/List'),
        keywords: `静态博客 ${siteConfig.owner}的个人博客 文章列表 博文`,
        description: `${siteConfig.owner}的个人博客-博客文章列表`
    },
    {
        path: '/article/:id',
        name: 'articleDetail',
        title: '文章详情',
        comp: ()=>import('@/views/article/Detail'),
        keywords: `静态博客 ${siteConfig.owner}的个人博客 文章详情`,
        description: `${siteConfig.owner}的个人博客-博客文章详情`
    },
    {
        path: '/record',
        name: 'record',
        title: '记录列表',
        comp: ()=>import('@/views/record/index'),
        keywords: `静态博客 ${siteConfig.owner}的个人博客 生活记录`,
        description: `${siteConfig.owner}的个人博客-个人生活记录`
    },
    {
        path: '/backend',
        name: 'backend',
        title: '后台管理',
        comp: ()=>import('@/views/backend/index'),
        keywords: `静态博客 ${siteConfig.owner}的个人博客 后端管理`,
        description: `${siteConfig.owner}的个人博客-后端管理`
    },
    {
        path: '/msg-board',
        name: 'msgBoard',
        title: '留言板',
        comp: ()=>import('@/views/msg-board/index'),
        keywords: `静态博客 ${siteConfig.owner}的个人博客 留言板`,
        description: `${siteConfig.owner}的个人博客-留言板`
    },
    {
        path: '/simple-code-simple-life',
        name: 'about',
        title: '简单代码-简单生活',
        comp: ()=>import('@/views/about/index'),
        keywords: `静态博客 ${siteConfig.owner}的个人博客 关于`,
        description: `${siteConfig.owner}的个人博客-关于`
    },
    {
        path: '/oauth',
        name: 'oauth',
        title: 'oauth验证',
        comp: ()=>import('@/views/comment/oauth'),
        keywords: `静态博客 ${siteConfig.owner}的个人博客 oauth`,
        description: `${siteConfig.owner}的个人博客-oauth`
    },
]

module.exports = {
    route: routes,
    routeInfo,
    queryMap
}
