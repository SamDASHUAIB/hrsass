const getters = {
  // 创建子模块 state 中的 属性的快捷访问
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  userName: (state) => state.user.userInfo.username, // userInfo 必须保证不为 null
  userId: (state) => state.user.userInfo.userId, // userInfo 必须保证不为 null
  staffPhoto: (state) => state.user.userInfo.staffPhoto, // 头像数据的快捷访问
  companyId: (state) => state.user.userInfo.companyId,
  routes: (state) => state.permission.routes, // 路由列表(静态路由 + 有权限的动态路由)
}
export default getters
/*
  可以发现一个规律, state.模块.对象.属性 的形式, 其中 对象必须保证不为 null 和 undefined 否则报错。
*/
