import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'

const state = {
  token: getToken(), // 设置 token 为共享状态, 初始化 vuex 先从缓存中取 token
}
const mutations = {
  SET_TOKEN(state, token) {
    state.token = token // 将收到的数据设置给 vuex
    // 将数据保存到 本地缓存, 与 vuex 同步
    setToken(token)
  },
  REMOVE_TOKEN(state) {
    state.token = null // vuex 置空
    removeToken() // 缓存置空
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
  },
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
