import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false;

import '@/icons'
import store from '@/store'
import router from '@/router'

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
