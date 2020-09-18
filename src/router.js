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
        path: '/backend',
        name: 'backend',
        redirect: {name: 'backend.config'},
        component: () => import('@/views/backend/index'),
        children: [
            {
                path: 'config',
                name: 'backend.config',
                component: () => import('@/views/backend/Config'),
            },
            {
                path: 'md',
                name: 'backend.md',
                component: () => import('@/views/backend/Md'),
            },
            {
                path: 'md/:id',
                name: 'backend.md.detail',
                component: ()=>import('@/views/backend/MdDetail')
            }
        ]
    },
];

export default new VueRouter({
    routes,
    // mode: 'history'
})
