import request from '@/utils/request'
/**
 * 获取角色列表
 * @param {Object} params 地址参数 query
 * @returns Promise
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params,
  })
}
/**
 * 获取公司基本信息
 * @param {string} companyId
 * @returns Promise
 */
export function getCompanyInfo(companyId) {
  return request({
    url: `/company/${companyId}`,
  })
}
/**
 * 根据 id 删除角色
 * @param {string} id
 * @returns Promise
 */
export function delRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete',
  })
}
/**
 * 根据 id 获取角色详情信息
 * @param {string} id
 * @returns Promise
 */
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
  })
}
/**
 * 根据 id 修改角色详情信息
 * @param {object} data
 * @returns Promise
 */
export function updateRoleDetail(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data,
  })
}
/**
 * 新增角色
 * @param {object} data
 * @returns Promise
 */
export function addRole(data) {
  return request({
    url: `/sys/role`,
    method: 'post',
    data,
  })
}
/**
 * 为角色分配权限
 * @param {object} data
 * @returns Promise
 */
export function assignPrem(data) {
  return request({
    url: `/sys/role/assignPrem`,
    method: 'put',
    data,
  })
}
