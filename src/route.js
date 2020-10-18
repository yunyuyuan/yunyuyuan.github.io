function routeInfo (){
    // 去掉最后的 '/'
    let pathname = window.location.pathname.replace(/^(.+?)\/*$/, '$1');
    for (let i of routes){
        let regexp = i.path.replace(/\/:(\w+)/g, '/(?<$1>[^/]+)');
        let matcher = pathname.match(new RegExp(`^${regexp}$`));
        if (matcher){
            return {
                name: i.name,
                params: matcher.groups||{},
                title: i.title
            }
        }
    }
    return {
        name: null,
        params: {},
        title: '404'
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

const routes = [
    {
        path: '/',
        name: 'index',
        title: '主页',
    },
    {
        path: '/article',
        name: 'article',
        title: '文章列表',
    },
    {
        path: '/article/:id',
        name: 'articleDetail',
        title: '文章详情',
    },
    {
        path: '/record',
        name: 'record',
        title: '记录列表',
    },
    {
        path: '/backend',
        name: 'backend',
        title: '后台管理',
    },
    {
        path: '/msg-board',
        name: 'msgBoard',
        title: '留言板',
    },
    {
        path: '/simple-code-simple-life',
        name: 'about',
        title: '简单代码-简单生活',
    },
]

module.exports = {
    route: routes,
    routeInfo,
    queryMap
}
