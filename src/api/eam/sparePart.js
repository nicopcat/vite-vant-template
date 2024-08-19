import http from '@/utils/request'


/**
 * 查询备件信息列表
 * @param query
 * @returns {*}
 */

export function getEamSparePartList(data) {
  return http.request({
    url: '/eam/EamSparePart/list',
    method: 'get',
    data,
  })
}

/**
 * 查询备件信息详细
 * @param id
 */
export function getEamSparePartDetail(id) {
  return http.request({
    url: '/eam/EamSparePart/' + id,
    method: 'get',
  })
}

/**
 * 新增备件信息
 * @param data
 */
export function addEamSparePart(data) {
  return http.request({
    url: '/eam/EamSparePart',
    method: 'post',
    data: data,
  })
}

/**
 * 修改备件信息
 * @param data
 */
export function editEamSparePart(data) {
  return http.request({
    url: '/eam/EamSparePart',
    method: 'put',
    data: data,
  })
}

/**
 * 删除备件信息
 * @param id
 */
export function deletedEamSparePart(ids) {
  return http.request({
    url: '/eam/EamSparePart/' + ids,
    method: 'delete',
  })
}
