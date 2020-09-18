import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

import '@/icons'
import store from '@/store'
import router from '@/router'
import {getConfig} from "@/utils";

getConfig().then(res => {
  if (res[0]) {
    store.commit('updateConfig', JSON.parse(res[1]))
    new Vue({
      store,
      router,
      render: h => h(App),
    }).$mount('#app');
  } else {
    console.log(res[1])
  }
})
