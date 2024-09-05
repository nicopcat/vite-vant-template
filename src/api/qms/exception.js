import http from '@/utils/request'

/**
 * 查询异常管理列表
 * @param query
 * @returns {*}
 */

export function getExceptionList(query) {
  return http.request({
    url: '/qms/exception/list',
    method: 'get',
    data: query,
  })
}

/**
 * 查询异常管理详细
 * @param id
 */
export function getExceptionDetail(id) {
  return http.request({
    url: '/qms/exception/' + id,
    method: 'get',
  })
}

/**
 * 新增异常管理
 * @param data
 */
export function addException(data) {
  return http.request({
    url: '/qms/exception',
    method: 'post',
    data: data,
  })
}

/**
 * 修改异常管理
 * @param data
 */
export function editException(data) {
  return http.request({
    url: '/qms/exception',
    method: 'put',
    data: data,
  })
}

/**
 * 删除异常管理
 * @param id
 */
export function deletedException(ids) {
  return http.request({
    url: '/qms/exception/' + ids,
    method: 'delete',
  })
}

/**
 * 导出异常管理
 * @param params
 */
// export function exportException(params) {
//   return http.request(
//     {
//       url: '/qms/exception/export?' + qs.stringify(params),
//       method: 'post',
//       responseType: 'blob',
//     },
//     {
//       isTransformResponse: false,
//     },
//   )
// }

/**
 * 异常处理
 * @param data
 */
export function handlingException(data) {
  return http.request({
    url: '/qms/exception/handle',
    method: 'put',
    data: data,
  })
}

/**
 * 异常查看
 * @param id
 */
export function getViewDetail(id) {
  return http.request({
    url: '/qms/exception/view/' + id,
    method: 'get',
  })
}

/**
 * 异常关闭
 * @param id
 */
export function closeException(data) {
  return http.request({
    url: '/qms/exception/close',
    method: 'put',
    data: data,
  })
}

/**
 * 异常复检
 * @param id
 */
export function recheckException(data) {
  return http.request({
    url: '/qms/exception/recheck',
    method: 'put',
    data: data,
  })
}

/**
 * 异常强制关闭
 * @param id
 */
export function shutdownException(data) {
  return http.request({
    url: '/qms/exception/shutdown',
    method: 'put',
    data: data,
  })
}

/**
 * 异常分拆
 * @param id
 */
export function splitException(data) {
  return http.request({
    url: '/qms/exception/split',
    method: 'put',
    data: data,
  })
}
