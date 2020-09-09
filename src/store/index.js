import mutations from "@/store/mutation";
import actions from "@/store/action";
import getters from "@/store/getter";

import Vue from 'vue'
import Vuex from 'vuex'
import config from "@/config";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        mdFile: config.md[config.md.length - 1].file
    },
    mutations,
    actions,
    getters
})