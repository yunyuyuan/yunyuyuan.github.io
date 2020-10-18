import Vue from "vue";
import './need';

const App = ()=>import('@/views/index')

new Vue({
    el: '#app',
    render: h => h(App)
});
