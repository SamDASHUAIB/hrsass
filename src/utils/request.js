// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'

const timeOut = 3600 // 设置超时时间为 3600 秒

const service = axios.create({
  // npm run dev(开发环境) => .env.development => /api (VUE_APP_BASE_API) => 触发跨域代理
  // npm run build (生产环境) => .env.production => /prod-api (VUE_APP_BASE_API) => 运维 nginx 反向代理
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
}) // 创建一个axios的实例
// 请求拦截器, 主要用于处理 token 统一注入
service.interceptors.request.use(
  // config 请求的配置信息
  (config) => {
    // Do something before request is sent
    // 注入 token
    if (store.getters.token) {
      // 有 token, 同时还需检查此 token 是否过期
      if (IsCheckTimeOut()) {
        // 超时, 执行登出操作, 跳转登录页
        store.dispatch('user/logout')
        router.push('/login')
        return Promise.reject(new Error('token 超时'))
      }
      // token 注入(有效期内的 token)
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    // 必须返回 config 否则报错, 没有 token 什么都不用做
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
/*
  响应拦截器
  处理返回的数据异常
*/
service.interceptors.response.use(
  (response) => {
    // 解构 data(我们需要的数据)
    // 注意 axios 默认添加的一层 data
    const { data, success, message } = response.data
    if (!success) {
      Message.error(message) // 提示错误信息
      return Promise.reject(new Error(message))
    }
    // 成功, 返回请求的数据
    return data
  },
  (error) => {
    // 多重解构, 前面的都是模式
    // const {
    //   response,
    //   response: { data },
    //   response: {
    //     data: { code },
    //   },
    // } = error
    if (
      error.response &&
      error.response.data &&
      error.response.data.code === 10002
      // response &&
      // data &&
      // code
    ) {
      // 后端响应 状态码 10002 此时表示, token 超时, 删除 token (登出操作)
      store.dispatch('user/logout')
      // 跳转 登录页
      router.push('/login')
    }
    Message.error(error.message) // 提示错误信息
    return Promise.reject(error) // 返回执行错误, 让当前的执行链跳出成功, 进入 catch
  }
)

/**
 * 判断 token 是否超时
 * @returns {Boolean} true 表示超时
 */
const IsCheckTimeOut = () => {
  const currentTime = Date.now()
  const timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > timeOut
}
export default service
