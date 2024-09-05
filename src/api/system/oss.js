import http from '@/utils/request'

// 查询OSS对象存储列表
export function getListOss(query) {
  return http.request({
    url: '/resource/oss/list',
    method: 'get',
    data: query,
  })
}

// 查询OSS对象基于id串
export function listByIds(ossId) {
  return http.request({
    url: '/resource/oss/listByIds/' + ossId,
    method: 'get',
  })
}

// 删除OSS对象存储
export function delOss(ossId) {
  return http.request({
    url: '/resource/oss/' + ossId,
    method: 'delete',
  })
}
