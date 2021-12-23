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
    //   筛选出 动态路由中和menus中能够对上的路由
    // menus.forEach((key) => {
    //   // key就是标识
    //   // asyncRoutes 找 有没有对象中的name属性等于 key的 如果找不到就没权限 如果找到了 要筛选出来
    //   routes.push(...asyncRoutes.filter((item) => item.name === key)) // 得到一个数组 有可能 有元素 也有可能是空数组
    // })
    menus.forEach((key) => {
      routes.push(...asyncRoutes.filter((route) => route.name === key))
    })
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
