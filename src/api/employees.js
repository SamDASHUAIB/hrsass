import request from '@/utils/request'
/**
 * 获取员工的简单列表
 * @returns Promise
 */
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple',
  })
}
/**
 * 获取员工的详情列表
 * @param {object} params
 * @returns Promise
 */
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params,
  })
}
/**
 * 根据 id 删除员工
 * @param {string} id
 * @returns Promise
 */
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete',
  })
}
/**
 * 新增员工
 * @param {object} data
 * @returns Promise
 */
export function addEmployee(data) {
  return request({
    url: `/sys/user`,
    method: 'post',
    data,
  })
}
/**
 * 批量导入员工(excel)
 * @param {array} data
 * @returns Promise
 */
export function importEmployee(data) {
  return request({
    url: `/sys/user/batch`,
    method: 'post',
    data,
  })
}
/**
 * 保存基本用户信息
 * @param {array} data
 * @returns Promise
 */
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data,
  })
}
/**
 * 获取用户个人信息
 * @param {string} id
 * @returns Promise
 */
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`,
  })
}
/**
 * 保存用户个人信息
 * @param {object} data
 * @returns Promise
 */
export function updatePersonalDetail(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data,
  })
}
/**
 * 获取用户的岗位信息
 * @param {string} id
 * @returns Promise
 */
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`,
  })
}
/**
 * 保存用户的岗位信息
 * @param {object} data
 * @returns Promise
 */
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data,
  })
}
/**
 * 分配角色给用户
 * @param {object} data 其中包含了 id
 * @returns Promise
 */
export function assignRole(data) {
  return request({
    url: `/sys/user/assignRoles`,
    method: 'put',
    data,
  })
}
