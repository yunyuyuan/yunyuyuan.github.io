import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
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
                component: () => import('@/views/article/List'),
            },
            {
                path: ':id',
                name: 'article.detail',
                component: () => import('@/views/article/Detail'),
            },
        ]
    },
    {
        path: '/msg-board',
        name: 'msgBoard',
        component: () => import('@/views/msg-board/index')
    },
    {
        path: '/back-end',
        name: 'backEnd',
        component: () => import('@/views/back-end/index'),
        children: [
            {
                path: '',
                name: 'backEnd.login',
                component: () => import('@/views/back-end/Login'),
            },
            {
                path: 'config',
                name: 'backEnd.config',
                component: () => import('@/views/back-end/Config'),
            },
            {
                path: 'md',
                name: 'backEnd.md',
                component: () => import('@/views/back-end/Md'),
            },
        ]
    },
];

export default new VueRouter({
    routes,
    // mode: 'history'
})
