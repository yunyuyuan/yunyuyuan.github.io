// --------- change this ↓ ---------
const
    name = 'yunyuyuan',
    repo = 'yunyuyuan.github.io',
    oauthDomain = 'https://blog.halberd.cn'
    // oauthDomain = 'http://localhost:8080'
// --------- change this ↑ ---------


module.exports = {
    // --------- change this ↓ ---------

    email: '326178275@qq.com',
    avatar: 'favicon.svg',
    corner: 'Simple code,Simple life',
    homeTitle: '清予生 淡予时',
    oauth: {
        client_id: '81ee614d8099242a1bce',
        client_secret: 'b05e85014297d9a3c34f8763f27dfeb6d19b392a',
        redirect_uri: oauthDomain + '/oauth'
    },
    tip: "代码改变世界(๑ˉ∀ˉ๑)",

    // --------- change this ↑ ---------

    owner: name,
    repo: repo,
    cdn: `https://cdn.jsdelivr.net/gh/${name}/${repo}@latest`,
    timeStamp: new Date().getTime(),
    rss: {
        title: `${name}的博客`,
        description: `${name}的博文Rss`,
        categories: 'Blog/Web development',
        ttl: 3600,
        // 最新的10个文章
        count: 10,
        /** Time By
         @create: 创建
         @update: 更新
         */
        timeBy: 'create'
    },
}