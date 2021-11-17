import request from '@/utils/request'
/**
 * 查询企业的部门列表
 * @returns Promise
 */
export function getDepartments() {
  return request({
    url: '/company/department',
  })
}
/**
 * 删除部门
 * @param {string} id
 * @returns Promise
 */
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete',
  })
}
/**
 * 新增部门
 * @param {object} department
 * @returns Promise
 */
export function addDepartments(department) {
  return request({
    url: `/company/department`,
    method: 'post',
    data: department, // 请求体参数
  })
}
/**
 * 根据 id 查询该部门详情数据
 * @param {string} id
 * @returns Promise
 */
export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`,
  })
}
/**
 * 根据 id 修改部门信息
 * @param {object} department
 * @returns Promise
 */
export function updateDepartment(department) {
  return request({
    url: `/company/department/${department.id}`,
    method: 'put',
    data: department,
  })
}
