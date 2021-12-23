import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission <control></control> 仅仅是引入 js 文件

import Components from '@/components'
// 全局 mixins
import CheckPermission from '@/mixin/checkPermission'

import * as filters from '@/filters'

// * as 变量的方式, 将所有"已标记导出"的整合为一个对象
import * as directives from '@/directives'
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach((key) => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})
// 注册过滤器
// 遍历所有的导出的过滤器函数 完成自定义全局注册
Object.keys(filters).forEach((key) => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

// 全局 mixins => 所有的组件都拥有了一个 checkPermission 方法, 用来检查权限(功能权限, 某个功能是否可以点击使用)
Vue.mixin(CheckPermission)

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.use(Components) // 所有的全局组件, 注册, 自定义插件, 需要 Vue.use()

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
})
