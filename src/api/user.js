import request from '@/utils/request'
/**
 * 登录接口
 * @param {Object} data 请求体参数
 * @returns Promise
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data, // data 是请求体参数, body 是路径参数
  })
}

export function getInfo(token) {}

export function logout() {}
