import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;
export const staticFolder = process.env.NODE_ENV === 'development'?'':'/dynamic';

import '@/icons'
import store from '@/store'
import router from '@/router'
import {getText} from "@/utils";

import selfImage from '@/image/i.png';

document.head.querySelector('link[rel="icon"]').href = selfImage;

new Vue({
    el: '#app',
    store,
    router,
    async mounted() {
        this.$store.commit('toggleLoading', true)
        let res = await getText(staticFolder + '/config.json');
        if (res[0]) {
            // 首次获取config
            this.$store.commit('updateConfig', JSON.parse(res[1]));
        } else {
            alert('获取网站配置失败!请检查网络并刷新网页')
        }
        this.$store.commit('toggleLoading', false)
    },
    render: h => h(App),
});