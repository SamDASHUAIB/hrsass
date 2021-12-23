import request from '@/utils/request'

/**
 * 获取所有权限点
 * @returns Promise
 */
export function getPermissionList() {
  return request({
    url: '/sys/permission',
  })
}
/**
 * 新增权限, 根据 id
 * @param {Object} data 请求体参数
 * @returns Promise
 */
export function addPermission(data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data,
  })
}

/**
 * 更新权限, 根据 id
 * @param {Object} data 请求体参数
 * @returns Promise
 */
export function updatePermission(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data,
  })
}

/**
 * 根据 id 删除权限
 * @param {String} id 请求体参数
 * @returns Promise
 */
export function delPermission(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete',
  })
}
/**
 * 根据 id 获取权限详情, 回写数据使用
 * @param {String} id 请求体参数
 * @returns Promise
 */
export function getPermissionDetail(id) {
  return request({
    url: `/sys/permission/${id}`,
  })
}
