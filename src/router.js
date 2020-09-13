import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: ()=>import('@/views/block/Home'),
    },
    {
        path: '/article',
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
        component: ()=>import('@/views/msg-board/index')
    }
];

export default new VueRouter({
    routes,
    // mode: 'history'
})
