import Vue from 'vue'
import App from './App.vue'
import siteConfig from '@/./site-config'

Vue.config.productionTip = false;
const isDev = process.env.NODE_ENV === 'development';
export const
    baseDynamicUrl = isDev?'':(siteConfig.cdn+'/dynamic'),
    originPrefix = location.origin.replace(/([^/])$/, '$1/') + (isDev?'':'dynamic');

import '@/icons'
import store from '@/store'
import router from '@/router'
import '@/filter'
import {getText} from "@/utils";

document.head.querySelector('link[rel="icon"]').href = `${originPrefix}/favicon.svg`;

async function init() {
    for (let i of ['config', 'md', 'record']) {
        let res = await getText(`${originPrefix}/json/${i}.json`);
        if (res[0]) {
            store.commit('updateJson', {
                key: i,
                json: JSON.parse(res[1])
            });
        } else {
            alert(`获取${i}失败!`)
            return
        }
    }
}

new Vue({
    el: '#app',
    store,
    router,
    beforeCreate() {
        init().then()
    },
    render: h => h(App),
});
