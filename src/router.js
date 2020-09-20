import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        meta: {
            title: '主页'
        },
        component: () => import('@/views/home/index'),
    },
    {
        path: '/article',
        name: 'article',
        component: () => import('@/views/article/index'),
        children: [
            {
                path: '',
                name: 'article.list',
                meta: {
                    title: '文章列表'
                },
                component: () => import('@/views/article/List'),
            },
            {
                path: ':id',
                name: 'article.detail',
                meta: {
                    title: '文章-'
                },
                component: () => import('@/views/article/Detail'),
            },
        ]
    },
    {
        path: '/msg-board',
        name: 'msgBoard',
        meta: {
            title: '留言板'
        },
        component: () => import('@/views/msg-board/index')
    },
    {
        path: '/backend',
        name: 'backend',
        redirect: {name: 'backend.config'},
        component: () => import('@/views/backend/index'),
        children: [
            {
                path: 'config',
                name: 'backend.config',
                meta: {
                    title: '后台-配置'
                },
                component: () => import('@/views/backend/Config'),
            },
            {
                path: 'md',
                name: 'backend.md',
                meta: {
                    title: '后台-文章列表'
                },
                component: () => import('@/views/backend/Md'),
            },
            {
                path: 'md/:id',
                name: 'backend.md.detail',
                meta: {
                    title: '后台-文章-'
                },
                component: () => import('@/views/backend/MdDetail')
            }
        ]
    },
];

let router = new VueRouter({
    routes,
    // mode: 'history'
});

router.beforeEach((to, from, next)=>{
    document.title = to.meta.title || '未知页面';
    next()
});

export default router