import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router/index'
/*
  为啥 userInfo 不能设置为null?
    const userInfo = {}
    console.log(userInfo.name) // undefined 不报错

    const userInfo = null
    OR
    const userInfo = undefined
    // 报错 TypeError: Cannot read properties of undefined (reading 'name')
    console.log(userInfo.name)
*/
const state = {
  token: getToken(), // 设置 token 为共享状态, 初始化 vuex 先从缓存中取 token
  userInfo: {}, // 这里定义成空对象, 不能定义成 null, 凡是对象, 给 {} 不要给 null
}
const mutations = {
  SET_TOKEN(state, token) {
    state.token = token // 将收到的数据设置给 vuex
    // 将数据保存到 Cookie, 与 vuex 同步
    setToken(token)
  },
  // token 失效处理, vuex Cookie 中均需处理。
  REMOVE_TOKEN(state) {
    state.token = null // vuex 置空
    removeToken() // 缓存置空
  },
  SET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo // 响应式
    // state.userInfo['username'] = userInfo 不是响应式, 追加属性, 需要使用 Vue.set() 或者 this.$set()
    // state.userInfo = { ...userInfo } // 浅拷贝, 响应式
  },
  // 退出登录，需要删除用户信息。
  REMOVE_USER_INFO(state) {
    state.userInfo = {}
  },
}
const actions = {
  /**
   * 登录业务的 action, 先调接口, 成功后, 将获得的 token 设置给 vuex(commit mutations), 失败的话则返回失败的
   * @param {Object} context 上下文对象
   * @param {Object} data 请求体参数, input 输入框收集的表单数据
   * @returns undefined
   */
  async login(context, data) {
    const result = await login(data) // 拿到 token
    // 设置 token
    // 数据在响应拦截器中, 已经处理好了, 直接可以获得, 无需解构
    context.commit('SET_TOKEN', result)
    // 登入成功(拿到 token 为成功的标志), 设置时间戳
    setTimeStamp()
  },
  /**
   * 获取用户名
   * @param {Object} context 上下文对象
   * @returns {Object} result 返回的数据
   */
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 拿到 userId (在上面的 result 里) 才能获取根据 id 获取员工基本信息, 主要是为了 头像数据
    const baseInfo = await getUserDetailById(result.userId)
    const baseResult = { ...result, ...baseInfo } // 将两个接口结果合并, 将用户头像数据和基本信息数据合并
    context.commit('SET_USER_INFO', baseResult)
    return result // 给后期做权限, 留下数据接口
  },
  /**
   * 登出
   * @param {Object} context 上下文对象
   */
  logout(context) {
    // 销毁 token(vuex 以及缓存中)
    // 清除 userInfo
    // mutations 中的都是同步代码
    context.commit('REMOVE_TOKEN')
    context.commit('REMOVE_USER_INFO')
    // 重置路由
    resetRouter()
    // 设置 permission 模块下的路由为初始状态(只有静态路由)
    /*
      如何实现在 user 子模块中调用 permission 子模块的 mutations ?
        namespaced: false 没有加锁, 自由访问
        namespaced: true 加锁后, context 不是全局, 只是 user 模块本身的
    */
    //  第三个参数, {root: true} 调用根级别的 mutations 或 actions
    context.commit('permission/SET_ROUTES', [], { root: true })
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
