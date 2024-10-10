import http from '@/utils/request'

/**
 * 查询点检工单列表
 * @param query
 * @returns {*}
 */

export function getEamSpotInspectionList(query) {
  return http.request({
    url: '/eam/EamSpotInspection/list',
    method: 'get',
    data: query,
  })
}

/**
 * 查询点检工单详细
 * @param id
 */
export function getEamSpotInspectionDetail(id) {
  return http.request({
    url: '/eam/EamSpotInspection/' + id,
    method: 'get',
  })
}

/**
 * 新增点检工单
 * @param data
 */
export function addEamSpotInspection(data) {
  return http.request({
    url: '/eam/EamSpotInspection',
    method: 'post',
    data: data,
  })
}

/**
 * 修改点检工单
 * @param data
 */
export function editEamSpotInspection(data) {
  return http.request({
    url: '/eam/EamSpotInspection',
    method: 'put',
    data: data,
  })
}

/**
 * 删除点检工单
 * @param id
 */
export function deletedEamSpotInspection(ids) {
  return http.request({
    url: '/eam/EamSpotInspection/' + ids,
    method: 'delete',
  })
}

/**
 * 执行点检工单
 * @param data
 */
export function executeEamSpotInspection(data) {
  return http.request({
    url: '/eam/EamSpotInspection/execute',
    method: 'put',
    data: data
  })
}

/**
 * 跳过点检工单
 * @param ids
 * @returns
 */
export function skipEamSpotInspection(ids, remark) {
  return http.request({
    url: `/eam/EamSpotInspection/skip/${ids}?remark=${remark}`,
    method: 'put',
  })
}

/**
 * 确认点检工单
 * @param data
 */
export function confirmEamSpotInspection(ids) {
  return http.request({
    url: '/eam/EamSpotInspection/confirm/' + ids,
    method: 'put',
  })
}


/**
 *  执行前根据设备id查询维保信息进行提醒
 */
export function getMaintenanceNotify(deviceId) {
  return http.request({
    url: `/eam/EamSpotInspection/maintenance-notify/${deviceId}`,
    method: 'GET'
  })
}