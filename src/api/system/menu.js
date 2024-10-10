import http from '@/utils/request'

/**
 * @description: 获取菜单
 */
export function listMenu() {
  return http.request({
    url: '/system/menu/getRoutersByClientType?clientType=mobile',
    method: 'get'
  })
}
