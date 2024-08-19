import http from '@/utils/request'
/**
 * @description: 字典列表
 */
export function getDictionaryList(data) {
  return http.request({
    url: '/system/dict/type/list',
    method: 'GET',
    data,
  })
}

/**
 * @description: 更改字典状态
 */
export function dictionaryStatusChanged(data) {
  return http.request({
    url: '/system/dict/type/changeStatus',
    method: 'put',
    data,
  })
}
// 新增字典
export function addDictionary(data) {
  return http.request({
    url: '/system/dict/type',
    method: 'post',
    data,
  })
}

// 编辑字典
export function editDictionary(data) {
  return http.request({
    url: '/system/dict/type',
    method: 'put',
    data,
  })
}
// 删除字典
export function deletedDictionary(ids) {
  return http.request({
    url: `/system/dict/type/${ids}`,
    method: 'delete',
  })
}
// 刷新字典缓存
export function refreshCache() {
  return http.request({
    url: `/system/dict/type/refreshCache`,
    method: 'delete',
  })
}

// 获取字典详情
export function getDictionaryDetail(id) {
  return http.request({
    url: `/system/dict/type/${id}`,
    method: 'get',
  })
}
// 分配字典数据权限
export function editDictionaryDataScope(data) {
  return http.request({
    url: '/system/dict/type/dataScope',
    method: 'put',
    data,
  })
}
/**
 * @description: 字典数据列表
 */
export function getDictionaryDataList(data) {
  return http.request({
    url: '/system/dict/data/list',
    method: 'GET',
    data,
  })
}

// 新增字典数据
export function addDictionaryData(data) {
  return http.request({
    url: '/system/dict/data',
    method: 'post',
    data,
  })
}

// 编辑字典数据
export function editDictionaryData(data) {
  return http.request({
    url: '/system/dict/data',
    method: 'put',
    data,
  })
}
// 删除字典数据
export function deletedDictionaryData(ids) {
  return http.request({
    url: `/system/dict/data/${ids}`,
    method: 'delete',
  })
}

// 获取字典数据详情
export function getDictionaryDataDetail(id) {
  return http.request({
    url: `/system/dict/data/${id}`,
    method: 'get',
  })
}
// 分配字典数据数据权限
export function editDictionaryDataDataScope(data) {
  return http.request({
    url: '/system/dict/data/dataScope',
    method: 'put',
    data,
  })
}

// 获取字典数据列表
export function getDictionaryDataListByType(key) {
  return http.request({
    url: `/system/dict/data/type/${key}`,
    method: 'GET',
  })
}
