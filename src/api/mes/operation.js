import http from '@/utils/request'
/**
 * 查询工序列表
 * @param query
 * @returns {*}
 */

export function getOperationList(query) {
  return http.request({
    url: '/mes/operation/list',
    method: 'get',
    data: query,
  })
}

/**
 * 查询工序详细
 * @param id
 */
export function getOperationDetail(id) {
  return http.request({
    url: '/mes/operation/' + id,
    method: 'get',
  })
}

/**
 * 新增工序
 * @param data
 */
export function addOperation(data) {
  return http.request({
    url: '/mes/operation',
    method: 'post',
    data: data,
  })
}

/**
 * 修改工序
 * @param data
 */
export function editOperation(data) {
  return http.request({
    url: '/mes/operation',
    method: 'put',
    data: data,
  })
}

/**
 * 删除工序
 * @param id
 */
export function deletedOperation(ids) {
  return http.request({
    url: '/mes/operation/' + ids,
    method: 'delete',
  })
}

/**
 * 导出工序
 * @param params
 */
// export function exportOperation(params) {
//   return http.request(
//     {
//       url: '/mes/operation/export?' + qs.stringify(params),
//       method: 'post',
//       responseType: 'blob',
//     },
//     {
//       isTransformResponse: false,
//     },
//   )
// }
