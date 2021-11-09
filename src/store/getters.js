const getters = {
  // 创建子模块 state 中的 属性的快捷访问
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  userName: (state) => state.user.userInfo.username, // userInfo 必须保证不为 null
  userId: (state) => state.user.userInfo.userId, // userInfo 必须保证不为 null
  staffPhoto: (state) => state.user.userInfo.staffPhoto, // 头像数据的快捷访问
}
export default getters
