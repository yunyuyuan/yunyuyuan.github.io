### github page的局限
本站是由#[github page](https://github.io)托管的，但是正常情况下它有几个缺点：

* 网速贼慢，或者不翻墙压根无法访问
* 无法使用vue router的history
* 静态网站没办法自身更新

> 接下来依次展示我的三个小技巧了![sticker](yellow-face/59)

#### jsdelivr非常🐂🍺的CDN
第一个问题，当然是最大的问题: **访问github page非常非常非常慢**，至于有多慢就得自己试试，由于已经解决了该问题，此站访问很快。

> 本节的主角是#[jsdelivr](https://www.jsdelivr.com/)，它是一个免费的优质cdn网站，提供npm，github等cdn加速

问题是如何在vue-cli中一键开启该cdn呢?下面用代码说明。

1. 修改`vue.config.js`。由#[jsdelivr的说明](https://www.jsdelivr.com/?docs=gh)可知，jsdelivr的cdn可以直接从url上加速github资源访问，所以我们修改`vue.config.js`如下:
```javascript
module.exports = {
    ......
    /* 如果是开发环境就默认未根目录
     * 如果是生产环境就打包为cdn前缀的目录
     *name即是github账户名
    **/
    publicPath: process.env.NODE_ENV === 'development'?'/':(`https://cdn.jsdelivr.net/gh/${name}/${name}.github.io@latest/dist`),
    ......
}
```
2. 需要写在vue里的cdn文件，使用前缀：
```javascript
const baseDynamicUrl = process.env.NODE_ENV === 'development'?'':(`https://cdn.jsdelivr.net/gh/${name}/${name}.github.io@latest/${your directory}`)
```

#### 使用404.html作为app
这是一个基于#[github.io的404](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)的骚操作。

> 思路是把`404.html`作为app，不写任何`index.html`以及`README.md`，让静态网站无论收到什么请求都*404*，然后手动写路由识别。下面介绍需要的步骤

1. 编辑`vue.config.js`：
```js
module.exports = {
    ......
    /* 如果是开发环境就正常打包
     * 如果是生产环境就打包index为404
    **/
    indexPath: process.env.NODE_ENV?'index.html':'../404.html',
    ......
}
```

2. 手写路由识别，其实这里可以用vue router的history路由的，但当时我打算自己写一个简单的：
```js
/**********
  route.js
***********/

// 获取路由变量
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
    ......
]

```
**在`index.vue`中这么使用：**
```js
<template>
......
<component :is="comp"/>
......
</template>
<script>
export default {
......
  created(){
    const route = routeInfo();
    document.title = route.title;

    // 判断路由位置
    switch (route.name){
      case 'index':
        this.routeNow = 'home';
        this.comp = ()=>import('@/views/home/index')
        break;
      case 'article':
        this.routeNow = 'article';
        this.comp = ()=>import('@/views/article/List');
        bread;
      ......
    }
  }
......
}
</script>
```
---
这样在打包完成后就只有一个`404.html`，所有请求都会转到这里，然后由js去决定加载哪个页面，这操作够![sticker](aru/79)吧。

#### 静态网站自我更新

> 这个没啥介绍的，只能说github牛逼![sticker](yellow-face/52)，此站的自我更新基于#[github rest api](https://developer.github.com/)。
> 这里的`自我更新`指的是使用静态网站本身更新网站，实在想不到别的术语了![sticker](aru/62)

---

就这么多了，本文结束!