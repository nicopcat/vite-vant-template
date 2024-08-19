import http from '@/utils/request'

/**
 * 查询维修工单列表
 * @param query
 * @returns {*}
 */

export function getEamRepairList(query) {
  return http.request({
    url: '/eam/EamRepair/list',
    method: 'get',
    data: query,
  })
}

/**
 * 查询维修工单详细
 * @param id
 */
export function getEamRepairDetail(id) {
  return http.request({
    url: '/eam/EamRepair/' + id,
    method: 'get',
  })
}

export function getAcceptDetailInfo(id) {
  return http.request({
    url: '/eam/EamRepair/accept/' + id,
    method: 'get',
  })
}

export function getDoneDetailInfo(id) {
  return http.request({
    url: '/eam/EamRepair/complete/' + id,
    method: 'get',
  })
}

export function getViewDetailInfo(id) {
  return http.request({
    url: '/eam/EamRepair/view/' + id,
    method: 'get',
  })
}

/**
 * 新增维修工单
 * @param data
 */
export function addEamRepair(data) {
  return http.request({
    url: '/eam/EamRepair',
    method: 'post',
    data: data,
  })
}

/**
 * 修改维修工单
 * @param data
 */
export function editEamRepair(data) {
  return http.request({
    url: '/eam/EamRepair',
    method: 'put',
    data: data,
  })
}

/**
 * 受理维修工单
 * @param data
 */
export function acceptEamRepair(data) {
  return http.request({
    url: '/eam/EamRepair/accept',
    method: 'put',
    data: data,
  })
}

/**
 * 保存维修工单
 * @param data
 */
export function saveEamRepair(data) {
  return http.request({
    url: '/eam/EamRepair/save',
    method: 'put',
    data: data,
  })
}

export function startEamRepair(data) {
  return http.request({
    url: '/eam/EamRepair/start',
    method: 'put',
    data: data,
  })
}

export function completeEamRepair(data) {
  return http.request({
    url: '/eam/EamRepair/complete',
    method: 'put',
    data: data,
  })
}

export function closeEamRepair(data) {
  return http.request({
    url: '/eam/EamRepair/close',
    method: 'put',
    data: data,
  })
}

export function undoEamRepair(data) {
  return http.request({
    url: '/eam/EamRepair/undo',
    method: 'put',
    data: data,
  })
}

/**
 * 删除维修工单
 * @param id
 */
export function deletedEamRepair(ids) {
  return http.request({
    url: '/eam/EamRepair/' + ids,
    method: 'delete',
  })
}

/**
 * 倒出维修工单
 * @param params
 */
export function exportItem(params) {
  return http.request(
    {
      url: '/eam/EamRepair/export?' + qs.stringify(params),
      method: 'post',
      responseType: 'blob',
    },
    {
      isTransformResponse: false,
    },
  )
}
