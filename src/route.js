const prefix = process.env.NODE_ENV === 'development'?'':'../';

function routeName (){
    let pathname = window.location.pathname.replace(/^(.+?)\/*$/, '$1');
    for (let i of route){
        if (i.path === pathname){
            return i.name
        }
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

const route = [
    {
        path: '/',
        name: 'index',
        title: '主页',
        htmlPath: prefix+'index.html',
    },
    {
        path: '/article',
        name: 'article',
        title: '文章列表',
        htmlPath: prefix+'article/index.html',
    },
    {
        path: '/record',
        name: 'record',
        title: '记录列表',
        htmlPath: prefix+'record/index.html',
    },
    {
        path: '/backend',
        name: 'backend',
        title: '后台管理',
        htmlPath: prefix+'backend/index.html',
    },
    {
        path: '/msg-board',
        name: 'msgBoard',
        title: '留言板',
        htmlPath: prefix+'msg-board/index.html',
    },
    {
        path: '/simple-code-simple-life',
        name: 'about',
        title: '简单代码-简单生活',
        htmlPath: prefix+'about/index.html',
    },
]

module.exports = {
    route,
    routeName,
    queryMap
}
