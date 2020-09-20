import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

import '@/icons'
import store from '@/store'
import router from '@/router'
import {getText} from "@/utils";

getText('/config.json').then(res => {
  if (res[0]) {
      // 首次获取config
      store.commit('updateConfig', JSON.parse(res[1]));
      new Vue({
          store,
          router,
          render: h => h(App),
      }).$mount('#app');
  } else {
      alert('获取网站配置失败!请检查网络并刷新网页')
  }
});
