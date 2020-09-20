import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;
export const staticFolder = process.env.NODE_ENV === 'development'?'':'/dynamic';

import '@/icons'
import store from '@/store'
import router from '@/router'
import {getText} from "@/utils";

document.head.querySelector('link[rel="icon"]').href = `${staticFolder}/favicon.ico`;

getText(staticFolder+'/config.json').then(res => {
  if (res[0]) {
      // 首次获取config
      store.commit('updateConfig', JSON.parse(res[1]));
      // 自定义hljs
      let style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = `${staticFolder}/hljs.css`;
      document.head.appendChild(style);

      new Vue({
          store,
          router,
          render: h => h(App),
      }).$mount('#app');
  } else {
      alert('获取网站配置失败!请检查网络并刷新网页')
  }
});
