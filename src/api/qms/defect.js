import http from '@/utils/request'
/**
 * 查询异常分类列表
 * @param query
 * @returns {*}
 */

export function getDefectList(query) {
  return http.request({
    url: '/qms/defect/list',
    method: 'get',
    data: query,
  })
}

/**
 * 查询异常分类详细
 * @param id
 */
export function getDefectDetail(id) {
  return http.request({
    url: '/qms/defect/' + id,
    method: 'get',
  })
}

/**
 * 新增异常分类
 * @param data
 */
export function addDefect(data) {
  return http.request({
    url: '/qms/defect',
    method: 'post',
    data: data,
  })
}

/**
 * 初始化异常分类
 */
export function initDefect() {
  return http.request({
    url: '/qms/defect/initDefect',
    method: 'post',
  })
}

/**
 * 修改异常分类
 * @param data
 */
export function editDefect(data) {
  return http.request({
    url: '/qms/defect',
    method: 'put',
    data: data,
  })
}

/**
 * 删除异常分类
 * @param id
 */
export function deletedDefect(ids) {
  return http.request({
    url: '/qms/defect/' + ids,
    method: 'delete',
  })
}

/**
 * 导出异常分类
 * @param params
 */
// export function exportDefect(params) {
//   return http.request(
//     {
//       url: '/qms/defect/export?' + qs.stringify(params),
//       method: 'post',
//       responseType: 'blob',
//     },
//     {
//       isTransformResponse: false,
//     },
//   )
// }
