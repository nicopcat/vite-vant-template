import { defineStore } from 'pinia'
import { asyncRoutes, constantRoutes } from '@/router'
import { listMenu } from '@/api/system/menu'
import ContentLayout from '@/layout/contentLayout.vue'

export const routerGenerator = (routerMap, parent) => {
  return routerMap.map(item => {
    console.log(item)

    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${(parent && parent.path) || ''}/${item.path}`,
      // 路由名称，建议唯一
      name: item.name || '',
      // 该路由对应页面的 组件
      component: item.component,
      // component: ContentLayout,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        ...item.meta,
        // 路由id
        id: item.id,
        label: item.meta?.title,
        icon: item.meta?.icon,
        permissions: item.meta?.permissions || null,
      },
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      //如果未定义 redirect 默认第一个子路由为 redirect
      !item.redirect && (currentRouter.redirect = `${item.path}/${item.children[0].path}`)
      // Recursion
      currentRouter.children = routerGenerator(item.children, currentRouter)
    }
    return currentRouter
  })
}
/**
 * 使用meta.role来确定当前用户是否有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const usePermissionStore = defineStore({
  id: 'permission',
  state: () => {
    return {
      routes: [],
      addRoutes: [],
      directivePermission: [],
    }
  },
  actions: {
    async SET_ROUTES(roles) {
      // const res = await listMenu()

      // const result = res.data.map(x => x.routers).reduce((acc, item) => acc.concat(item), []);
      // const routes = routerGenerator(result)
      // console.log(routes);
      return new Promise(resolve => {
        let accessedRoutes
        if (roles.includes('superadmin')) {
          accessedRoutes = asyncRoutes || []
          // accessedRoutes = routes || []
        } else {
          accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
          // accessedRoutes = filterAsyncRoutes(routes, roles)
        }
        this.addRoutes = accessedRoutes
        this.routes = constantRoutes.concat(accessedRoutes)

        resolve(accessedRoutes)
      })
    },
    SET_DIRECTIVE_ROLE(roles) {
      this.directivePermission = roles
    },
  },
})

export default usePermissionStore
