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
