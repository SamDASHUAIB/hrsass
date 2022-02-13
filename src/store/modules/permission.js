import { constantRoutes, asyncRoutes } from '@/router/index'

const state = {
  routes: constantRoutes, // 路由表, 当前用户拥有的所有路由的数组(所有静态路由 + 有权限的动态路由)
}
const mutations = {
  // 修改 routes 的 mutation
  // payload 就是用户登录成功需要添加的新路由 newRoutes
  SET_ROUTES(state, newRoutes) {
    // 要用 constantRoutes 不要用 state.routes (累加, 错误逻辑)
    state.routes = [...constantRoutes, ...newRoutes]
  },
}
const actions = {
  // 标识 匹配 路由 (name) 标识数组通过 userInfo.roles.menus 可以拿到
  filterRoutes(context, menus) {
    const routes = []
    // 对每一个 menu 进行匹配，和动态路由进行匹配，匹配上了，说明用户有权限访问这个页面，添加到用户的路由表（数组）中。
    menus.forEach((key) => {
      routes.push(...asyncRoutes.filter((route) => route.name === key))
    }) // filter 的结果是一个数组（含有一个元素OR空数组），用展开运算符，拆开。
    context.commit('SET_ROUTES', routes) // 左菜单栏需要, 组件 sidebar 需要
    return routes // 用来动态增加路由的, 给 addRoutes 用
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
