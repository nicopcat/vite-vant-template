import http from '@/utils/request'

/**
 * 查询设备列表
 * @param query
 * @returns {*}
 */

export function getEamDeviceList(data) {
  return http.request({
    url: '/eam/EamDevice/list',
    method: 'get',
    data,
  })
}

/**
 * 查询设备详细
 * @param id
 */
export function getEamDeviceDetail(id ) {
  return http.request({
    url: '/eam/EamDevice/' + id,
    method: 'get',
  })
}

/**
 * 新增设备
 * @param data
 */
export function addEamDevice(data) {
  return http.request({
    url: '/eam/EamDevice',
    method: 'post',
    data: data,
  })
}

/**
 * 修改设备
 * @param data
 */
export function editEamDevice(data) {
  return http.request({
    url: '/eam/EamDevice',
    method: 'put',
    data: data,
  })
}

/**
 * 删除设备
 * @param id
 */
export function deletedEamDevice(ids) {
  return http.request({
    url: '/eam/EamDevice/' + ids,
    method: 'delete',
  })
}
