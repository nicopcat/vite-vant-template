import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

import Layout from '@/layout/index.vue'
import MsgLayout from '@/layout/msg.vue'
import NormalLayout from '@/layout/normalLayout.vue'
import ContentLayout from '@/layout/contentLayout.vue'

//配置路由信息
export const constantRoutes = [
  {
    path: '/redirect',
    name: 'Redirect',
    component: Layout,
    meta: {
      title: 'Redirect',
      hidden: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/redirect/index.vue'),
        meta: {
          title: 'Redirect',
          hidden: true,
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
      title: '登录',
    },
  },
  {
    path: '/',
    name: 'Home',
    component: NormalLayout,
    redirect: '/index',
    meta: {
      title: 'Home',
      hidden: true,
    },
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '工作台',
          noCache: true,
        },
      },
    ],
  },
  {
    name: 'User',
    path: '/user',
    component: () => import('@/views/userCenter/index.vue'),
    hidden: false,
    meta: {
      title: '个人中心',
      icon: 'user',
      noCache: true,
    },
  },
  {
    path: '/register',
    name: 'Register',
    hidden: true,
    component: () => import('@/views/login/register.vue'),
    meta: {
      title: '注册',
      noCache: true,
    },
  },
  {
    path: '/forgot',
    name: 'Forgot',
    hidden: true,
    component: () => import('@/views/login/forgot.vue'),
    meta: {
      title: '忘记密码',
      noCache: true,
    },
  },
  {
    path: '/404',
    name: 'Error404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      hidden: true,
      title: '404',
    },
  },
  {
    path: '/401',
    name: 'Error401',
    component: () => import('@/views/error/401.vue'),
    meta: {
      hidden: true,
      title: '401',
    },
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
    name: 'Redirect404',
    meta: {
      title: '404',
      hidden: true,
    },
  },
]

// export const asyncRoutes = []

export const asyncRoutes = [
  {
    path: '/message',
    name: 'Message',
    component: MsgLayout,
    redirect: '/message',
    children: [
      {
        path: '',
        name: 'Message',
        component: () => import('@/views/message/index.vue'),
        meta: {
          title: '消息',
          //icon: "Message",
          noCache: true,
        },
      },
    ],
  },

  {
    path: '/qms/qualityLot',
    name: 'QualityLotIndex',
    component: ContentLayout,
    redirect: '/qms/qualityLot/index',
    children: [
      {
        path: 'index',
        name: 'QualityLotIndex',
        component: () => import('@/views/qms/qualityLot/index'),
        meta: {
          title: '检验批管理',
          //icon: "Find",
          noCache: true,
        },
      },
      {
        path: 'execute',
        name: 'QualityLotExecute',
        component: () => import('@/views/qms/qualityLot/execute'),
        meta: {
          title: '检验批执行',
          noCache: true,
        },
      },
      {
        path: 'detail',
        name: 'QualityLotDetail',
        component: () => import('@/views/qms/qualityLot/detail'),
        meta: {
          title: '检验批详情',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/qms/exception',
    name: 'Exception',
    component: ContentLayout,
    redirect: '/qms/exception/index',
    children: [
      {
        path: 'index',
        name: 'Exception',
        component: () => import('@/views/qms/exception/index'),
        meta: {
          title: '异常管理',
          noCache: true,
        },
      },
      {
        path: 'view',
        name: 'ExceptionView',
        component: () => import('@/views/qms/exception/view'),
        meta: {
          title: '详情',
          noCache: true,
        },
      },
      {
        path: 'new',
        name: 'ExceptionNew',
        component: () => import('@/views/qms/exception/new'),
        meta: {
          title: '异常新增',
          noCache: true,
        },
      },
      {
        path: 'handle',
        name: 'ExceptionHandle',
        component: () => import('@/views/qms/exception/handle'),
        meta: {
          title: '异常处理',
          noCache: true,
        },
      },
      {
        path: 'close',
        name: 'ExceptionClose',
        component: () => import('@/views/qms/exception/close'),
        meta: {
          title: '异常关闭',
          noCache: true,
        },
      },
      {
        path: 'recheck',
        name: 'ExceptionRecheck',
        component: () => import('@/views/qms/exception/recheck'),
        meta: {
          title: '异常复检',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/eam/repair/report',
    name: 'RepairReport',
    component: ContentLayout,
    redirect: '/eam/repair/report/index',
    children: [
      {
        path: 'index',
        name: 'RepairReportIndex',
        component: () => import('@/views/eam/repair/report/index'),
        meta: {
          title: '设备报修',
          noCache: true,
        },
      },
      {
        path: 'view',
        name: 'RepairView',
        component: () => import('@/views/eam/repair/view'),
        meta: {
          title: '详情',
          noCache: true,
        },
      },
      {
        path: 'new',
        name: 'RepairNew',
        component: () => import('@/views/eam/repair/new'),
        meta: {
          title: '新增',
          noCache: true,
        },
      },
      {
        path: 'edit',
        name: 'RepairEdit',
        component: () => import('@/views/eam/repair/edit'),
        meta: {
          title: '更改',
          noCache: true,
        },
      },
      {
        path: 'accept',
        name: 'RepairAccept',
        component: () => import('@/views/eam/repair/accept'),
        meta: {
          title: '受理',
          noCache: true,
        },
      },
      {
        path: 'complete',
        name: 'RepairComplete',
        component: () => import('@/views/eam/repair/complete'),
        meta: {
          title: '完成',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/eam/repair/ongoing',
    name: 'RepariOngoing',
    component: ContentLayout,
    redirect: '/eam/repair/ongoing/index',
    children: [
      {
        path: 'index',
        name: 'RepairOngoingIndex',
        component: () => import('@/views/eam/repair/ongoing/index'),
        meta: {
          title: '设备维修',
          noCache: true,
        },
      },
      {
        path: 'view',
        name: 'RepairView',
        component: () => import('@/views/eam/repair/view'),
        meta: {
          title: '详情',
          noCache: true,
        },
      },
      {
        path: 'edit',
        name: 'RepairEdit',
        component: () => import('@/views/eam/repair/edit'),
        meta: {
          title: '更改',
          noCache: true,
        },
      },
      {
        path: 'accept',
        name: 'RepairAccept',
        component: () => import('@/views/eam/repair/accept'),
        meta: {
          title: '受理',
          noCache: true,
        },
      },
      {
        path: 'complete',
        name: 'RepairComplete',
        component: () => import('@/views/eam/repair/complete'),
        meta: {
          title: '完成',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/eam/repair/all',
    name: 'RepairAll',
    component: ContentLayout,
    redirect: '/eam/repair/all/index',
    children: [
      {
        path: 'index',
        name: 'RepairAllIndex',
        component: () => import('@/views/eam/repair/all/index'),
        meta: {
          title: '维修单查询',
          noCache: true,
        },
      },
      {
        path: 'view',
        name: 'RepairView',
        component: () => import('@/views/eam/repair/view'),
        meta: {
          title: '详情',
          noCache: true,
        },
      },
      {
        path: 'edit',
        name: 'RepairEdit',
        component: () => import('@/views/eam/repair/edit'),
        meta: {
          title: '更改',
          noCache: true,
        },
      },
      {
        path: 'accept',
        name: 'RepairAccept',
        component: () => import('@/views/eam/repair/accept'),
        meta: {
          title: '受理',
          noCache: true,
        },
      },
      {
        path: 'complete',
        name: 'RepairComplete',
        component: () => import('@/views/eam/repair/complete'),
        meta: {
          title: '完成',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/eam/maintenancePlan',
    name: 'MaintenancePlan',
    component: ContentLayout,
    redirect: '/eam/maintenancePlan/index',
    children: [
      {
        path: 'index',
        name: 'MaintenancePlanIndex',
        component: () => import('@/views/eam/maintenancePlan/index'),
        meta: {
          title: '保养计划',
          noCache: true,
        },
      },
      {
        path: 'new',
        name: 'MaintenancePlanNew',
        component: () => import('@/views/eam/maintenancePlan/new'),
        meta: {
          title: '新增',
          noCache: true,
        },
      },
      {
        path: 'detail',
        name: 'MaintenancePlanDetail',
        component: () => import('@/views/eam/maintenancePlan/detail'),
        meta: {
          title: '详情',
          noCache: true,
        },
      },
      {
        path: 'execute',
        name: 'MaintenancePlanExecute',
        component: () => import('@/views/eam/maintenancePlan/execute'),
        meta: {
          title: '执行',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/eam/maintenance',
    name: 'Maintenance',
    component: ContentLayout,
    redirect: '/eam/maintenance/index',
    children: [
      {
        path: 'index',
        name: 'MaintenanceIndex',
        component: () => import('@/views/eam/maintenance/index'),
        meta: {
          title: '保养工单',
          noCache: true,
        },
      },
      {
        path: 'new',
        name: 'MaintenanceNew',
        component: () => import('@/views/eam/maintenance/new'),
        meta: {
          title: '新增',
          noCache: true,
        },
      },
      {
        path: 'accept',
        name: 'MaintenanceAccept',
        component: () => import('@/views/eam/maintenance/accept'),
        meta: {
          title: '受理',
          noCache: true,
        },
      },
      {
        path: 'detail',
        name: 'MaintenanceDetail',
        component: () => import('@/views/eam/maintenance/detail'),
        meta: {
          title: '详情',
          noCache: true,
        },
      },
      {
        path: 'execute',
        name: 'MaintenanceExecute',
        component: () => import('@/views/eam/maintenance/execute'),
        meta: {
          title: '执行',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/eam/spotInspection',
    name: 'SpotInspection',
    component: ContentLayout,
    redirect: '/eam/spotInspection/index',
    children: [
      {
        path: 'index',
        name: 'SpotInspectionIndex',
        component: () => import('@/views/eam/spotInspection/index'),
        meta: {
          title: '点检任务',
          noCache: true,
        },
      },
      {
        path: 'detail',
        name: 'SpotInspectionDetail',
        component: () => import('@/views/eam/spotInspection/detail'),
        meta: {
          title: '详情',
          noCache: true,
        },
      },
      {
        path: 'new',
        name: 'SpotInspectionNew',
        component: () => import('@/views/eam/spotInspection/new'),
        meta: {
          title: '新增',
          noCache: true,
        },
      },
      {
        path: 'execute',
        name: 'SpotInspectionExecute',
        component: () => import('@/views/eam/spotInspection/execute'),
        meta: {
          title: '执行',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/eam/unplannedCollection',
    name: 'UnplannedCollection',
    component: ContentLayout,
    redirect: '/eam/unplannedCollection/index',
    children: [
      {
        path: 'index',
        name: 'UnplannedCollectionIndex',
        component: () => import('@/views/eam/unplannedCollection/index'),
        meta: {
          title: '非计划时间采集',
          noCache: true,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory('./'),
  // history: createWebHistory('./'), //history mode
  routes: constantRoutes.concat(asyncRoutes),
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
  const WHITE_NAME_LIST = ['Login', 'Home', 'Index', 'User']
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
