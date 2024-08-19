import http from '@/utils/request'

/**
 * 查询设备关联点检方案列表
 * @param query
 * @returns {*}
 */

export function getEamDeviceSpotInspectionList(query) {
  return http.request({
    url: '/eam/EamDeviceSpotInspection/list',
    method: 'get',
    data: query,
  })
}

/**
 * 查询设备关联点检方案详细
 * @param id
 */
export function getEamDeviceSpotInspectionDetail(id) {
  return http.request({
    url: '/eam/EamDeviceSpotInspection/' + id,
    method: 'get',
  })
}

/**
 * 新增设备关联点检方案
 * @param data
 */
export function addEamDeviceSpotInspection(data) {
  return http.request({
    url: '/eam/EamDeviceSpotInspection',
    method: 'post',
    data: data,
  })
}

/**
 * 修改设备关联点检方案
 * @param data
 */
export function editEamDeviceSpotInspection(data) {
  return http.request({
    url: '/eam/EamDeviceSpotInspection',
    method: 'put',
    data: data,
  })
}

/**
 * 删除设备关联点检方案
 * @param id
 */
export function deletedEamDeviceSpotInspection(ids) {
  return http.request({
    url: '/eam/EamDeviceSpotInspection/' + ids,
    method: 'delete',
  })
}
