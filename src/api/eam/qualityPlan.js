import http from '@/utils/request'
/**
 * @description: 检验方案列表
 */
export function getQualityPlanList(data) {
  return http.request({
    url: '/eam/EamQualityPlan/list',
    method: 'GET',
    data,
  })
}

// 新增检验方案
export function addQualityPlan(data) {
  return http.request({
    url: '/eam/EamQualityPlan',
    method: 'post',
    data,
  })
}

// 编辑检验方案
export function editQualityPlan(data) {
  return http.request({
    url: '/eam/EamQualityPlan',
    method: 'put',
    data,
  })
}
// 删除检验方案
export function deletedQualityPlan(ids) {
  return http.request({
    url: `/eam/EamQualityPlan/${ids}`,
    method: 'delete',
  })
}

// 获取检验方案详情
export function getQualityPlanDetail(id) {
  return http.request({
    url: `/eam/EamQualityPlan/${id}`,
    method: 'get',
  })
}
