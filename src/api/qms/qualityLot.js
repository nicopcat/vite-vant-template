import http from '@/utils/request'

/**
 * @description: 检验批列表
 */
export function getQualityLotList(data) {
  return http.request({
    url: '/qms/qualityLot/list',
    method: 'GET',
    data,
  })
}

export function closeQualityLot(data) {
  return http.request({
    url: '/qms/qualityLot/close',
    method: 'POST',
    data,
  })
}

// 导出检验批
export function exportQualityLot(params) {
  return http.request(
    {
      url: `/qms/qualityLot/export?${qs.stringify(params)}`,
      method: 'post',
      responseType: 'blob',
    },
    {
      isTransformResponse: false,
    }
  )
}

export function getExecuteInfo(id) {
  return http.request({
    url: `/qms/qualityLot/execute/${id}`,
    method: 'GET',
  })
}

export function saveQualityLot(data) {
  return http.request({
    url: '/qms/qualityLot/save',
    method: 'post',
    data,
  })
}

export function submitQualityLot(data) {
  return http.request({
    url: '/qms/qualityLot/submit',
    method: 'post',
    data,
  })
}

export function saveInspectionRecords(data) {
  return http.request({
    url: '/qms/qualityLot/saveInspectionRecords',
    method: 'put',
    data,
  })
}

export function submitInspectionRecords(data) {
  return http.request({
    url: '/qms/qualityLot/submitInspectionRecords',
    method: 'put',
    data,
  })
}
