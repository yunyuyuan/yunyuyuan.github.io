import Vue from 'vue'
import IconSvg from '@/assets/icons/IconSvg'// svg组件

// register globally
Vue.component('svg-icon', IconSvg)

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/assets/icons/svg', true, /\.svg$/)
requireAll(req)