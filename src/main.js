import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

import '@/icons'
import store from '@/store'
import router from '@/router'

fetch('/config.json').then(res => {
  res.text().then(res => {
    store.commit('initConfig', JSON.parse(res))

    new Vue({
      store,
      router,
      render: h => h(App),
    }).$mount('#app');

  })
})
