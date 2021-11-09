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
/**
 * 获取用户基本资料
 * @returns Promise
 */
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post',
  })
}
/**
 * 根据 id 获取员工的基本信息, 头像数据
 * @param {String} id 员工id userId
 * @returns Promise
 */
export function getUserDetailById(id) {
  return request({
    // 路径参数, 直接拼接在 url 请求路径中即可
    url: `/sys/user/${id}`,
  })
}

export function getInfo(token) {}

export function logout() {}
