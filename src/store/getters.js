const getters = {
  // 创建子模块 state 中的 属性的快捷访问
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
}
export default getters
