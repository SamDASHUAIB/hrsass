// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import { Message } from 'element-ui'

const service = axios.create({
  // npm run dev(开发环境) => .env.development => /api (VUE_APP_BASE_API) => 触发跨域代理
  // npm run build (生产环境) => .env.production => /prod-api (VUE_APP_BASE_API) => 运维 nginx 反向代理
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
}) // 创建一个axios的实例
service.interceptors.request.use() // 请求拦截器
service.interceptors.response.use(
  (response) => {
    // 解构 data(我们需要的数据)
    // 注意 axios 默认添加的一层 data
    const { data, success, message } = response.data
    if (!success) {
      Message.error(message) // 提示错误信息
      return Promise.reject(new Error(message)) // 业务错误, 进入 catch
    }
    // 成功, 返回请求的数据
    return data
  },
  (error) => {
    Message.error(error.message) // 提示错误信息
    return Promise.reject(error) // 返回执行错误, 让当前的执行链跳出成功, 进入 catch
  }
)
export default service
