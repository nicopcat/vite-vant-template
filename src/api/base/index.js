import http from '@/utils/request'
/**
 * 查询物料列表
 * @param query
 * @returns {*}
 */

export function getItemList(query) {
  return http.request({
    url: '/base/item/list',
    method: 'get',
    data: query,
  })
}

export function getWorkStationList(query) {
  return http.request({
    url: '/base/workStation/list',
    method: 'get',
    data: query,
  })
}

/**
 * 查询班组列表
 * @param query
 * @returns {*}
 */

export function listClass(data) {
  return http.request({
    url: '/base/class/list',
    method: 'get',
    data: data,
  })
}
/**
 * 查询供应商列表
 * @param query
 * @returns {*}
 */

export function listSupplier(query) {
  return http.request({
    url: '/base/supplier/list',
    method: 'get',
    data: query,
  })
}
