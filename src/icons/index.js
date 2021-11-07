import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // svg component

// register globally
Vue.component('svg-icon', SvgIcon)

// 读取所有 .svg 后缀的文件
const req = require.context('./svg', false, /\.svg$/)
// 将所有的 svg 目录下的所有的 .svg 后缀的文件全都引入到项目中
const requireAll = (requireContext) => requireContext.keys().map(requireContext)
requireAll(req)
