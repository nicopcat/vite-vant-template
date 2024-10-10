import http from '@/utils/request'

/**
 * 查询保养工单列表
 * @param query
 * @returns {*}
 */

export function getEamMaintenanceList(query) {
  return http.request({
    url: '/eam/EamMaintenance/list',
    method: 'get',
    data: query,
  })
}

/**
 * 查询保养工单详细
 * @param id
 */
export function getEamMaintenanceDetail(id) {
  return http.request({
    url: '/eam/EamMaintenance/' + id,
    method: 'get',
  })
}

/**
 * 新增保养工单
 * @param data
 */
export function addEamMaintenance(data) {
  return http.request({
    url: '/eam/EamMaintenance',
    method: 'post',
    data: data,
  })
}

/**
 * 修改保养工单
 * @param data
 */
export function editEamMaintenance(data) {
  return http.request({
    url: '/eam/EamMaintenance',
    method: 'put',
    data: data,
  })
}

/**
 * 删除保养工单
 * @param id
 */
export function deletedEamMaintenance(ids) {
  return http.request({
    url: '/eam/EamMaintenance/' + ids,
    method: 'delete',
  })
}

export function skipEamMaintenance(ids, remark) {
  return http.request({
    url: `/eam/EamMaintenance/skip/${ids}?remark=${remark}`,
    method: 'delete',
  })
}

/**
 * 受理保养工单
 * @param data
 */
export function updatePending(data) {
  return http.request({
    url: '/eam/EamMaintenance/updatePending',
    method: 'put',
    data: data,
  })
}

// 获取字典数据列表
export function getDictionaryDataListByType(key) {
  return http.request({
    url: `/system/dict/data/type/${key}`,
    method: 'GET',
  })
}

export function getExecuteInfo(id) {
  return http.request({
    url: `/eam/EamMaintenance/execute/${id}`,
    method: 'GET',
  })
}

/**
 * 开始保养
 * @param data
 */
export function startEamMaintenance(id) {
  return http.request({
    url: `/eam/EamMaintenance/startMaintenance/${id}`,
    method: 'put',
  })
}

/**
 * 结束保养
 * @param data
 */
export function endEamMaintenance(id) {
  return http.request({
    url: '/eam/EamMaintenance/endMaintenance/' + id,
    method: 'put',
  })
}

/**
 * 停机
 * @param data
 */
export function shutdown(id) {
  return http.request({
    url: '/eam/EamMaintenance/shutdown/' + id,
    method: 'put',
  })
}

/**
 * 停机重启
 * @param data
 */
export function restart(id) {
  return http.request({
    url: '/eam/EamMaintenance/restart/' + id,
    method: 'put',
  })
}

/**
 * 保存保养记录
 * @param data
 */
export function save(data) {
  return http.request({
    url: '/eam/EamMaintenance/save',
    method: 'put',
    data: data,
  })
}

/**
 * 提交保养记录
 * @param data
 */
export function submit(data) {
  return http.request({
    url: '/eam/EamMaintenance/submit',
    method: 'put',
    data: data,
  })
}


/**
 * 确认保养工单
 */
export function confirmEamMaintenance(id) {
  return http.request({
    url: `/eam/EamMaintenance/confirm/${id}`,
    method: 'put',
  })
}
