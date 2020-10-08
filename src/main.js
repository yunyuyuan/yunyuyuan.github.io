import Vue from 'vue'
import App from './App.vue'
import siteConfig from '@/./site-config'

Vue.config.productionTip = false;
const isDev = process.env.NODE_ENV === 'development';
export const
    dynamicUrl = isDev?'':'dynamic',
    cdnDynamic = (isDev?'':siteConfig.cdn+'/') + dynamicUrl,
    originPrefix = `${location.origin}/${dynamicUrl}`

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
            alert('获取网站配置失败!请检查网络并刷新网页')
            return
        }
    }
}

init().then(r => {
    new Vue({
        el: '#app',
        store,
        router,
        render: h => h(App),
    });
});
