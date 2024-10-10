import http from '@/utils/request'

/**
 * 查询非计划时间采集列表
 * @param query
 * @returns {*}
 */

export function getLgzyDeviceUnplannedList(query) {
  return http.request({
    url: '/custom/lgzy/device/unplanned-collection/list',
    method: 'get',
    data: query,
  })
}



/**
 * 查询非计划时间采集详细
 * @param id
 */
export function getLgzyDeviceUnplannedDetail(id) {
  return http.request({
    url: `/custom/lgzy/device/unplanned-collection/${id}`,
    method: 'get',
  })
}

/**
 * 新增非计划时间采集
 * @param data
 */
export function addLgzyUnplannedDevice(data) {
  return http.request({
    url: '/custom/lgzy/device/unplanned-collection',
    method: 'post',
    data: data,
  })
}

/**
 * 修改非计划时间采集
 * @param data
 */
export function editLgzyUnplannedDevice(data) {
  return http.request({
    url: '/custom/lgzy/device/unplanned-collection',
    method: 'put',
    data: data,
  })
}

/**
 * 删除非计划时间采集
 * @param id
 */
export function deletedLgzyUnplannedDevice(ids) {
  return http.request({
    url: `/custom/lgzy/device/unplanned-collection/${ids}`,
    method: 'delete',
  })
}
