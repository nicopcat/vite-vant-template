import { createRouter, createWebHistory } from 'vue-router'

import Layout from '@/layout/index.vue'
import MsgLayout from '@/layout/msg.vue'
import NormalLayout from '@/layout/normalLayout.vue'

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
]

export const asyncRoutes = [
  //{
  //path : '/',
  //name : 'Dashboard',
  //component : Layout,
  //redirect : '/dashboard',
  //meta : {
  //title : '主页'
  //},
  //children : [
  //{
  //path : 'dashboard',
  //name : 'Dashboard',
  //component : () => import( '@/views/dashboard/index.vue' ),
  //meta : {
  //title : '主页',
  //icon : 'dashboard',
  //noCache : true,
  //affix : true
  //}
  //}
  //]
  //},
  {
    path: '/',
    name: 'Home',
    component: NormalLayout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '工作台',
          //icon: "Find",
          noCache: true,
          roles: ['admin', 'user'],
        },
      },
    ],
  },
  {
    path: '/user',
    component: () => import('@/views/userCenter/index.vue'),
    hidden: false,
    meta: {
      title: '个人中心',
      icon: 'user',
      noCache: true,
      //roles : ['admin', 'user'],
    },
  },

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
          roles: ['admin', 'user'],
        },
      },
    ],
  },

  {
    path: '/find',
    name: 'Find',
    component: NormalLayout,
    redirect: '/find',
    children: [
      {
        path: '',
        name: 'Find',
        component: () => import('@/views/find/index.vue'),
        meta: {
          title: '发现',
          //icon: "Find",
          noCache: true,
          roles: ['admin', 'user'],
        },
      },
    ],
  },
  {
    path: '/qms/qualityLot',
    name: 'QualityLotIndex',
    component: NormalLayout,
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
          roles: ['admin', 'user'],
        },
      },
      {
        path: 'execute',
        name: 'QualityLotExecute',
        component: () => import('@/views/qms/qualityLot/execute'),
        meta: {
          title: '检验批执行',
          //icon: "Find",
          noCache: true,
          roles: ['admin', 'user'],
        },
      },
      {
        path: 'detail',
        name: 'QualityLotDetail',
        component: () => import('@/views/qms/qualityLot/detail'),
        meta: {
          title: '检验批详情',
          //icon: "Find",
          noCache: true,
          roles: ['admin', 'user'],
        },
      },
    ],
  },

  {
    path: '/eam/repair',
    name: 'Repair',
    component: NormalLayout,
    redirect: '/eam/repair/index',
    children: [
      {
        path: 'index',
        name: 'Repairindex',
        component: () => import('@/views/eam/repair/index'),
        meta: {
          title: '设备维修管理',
          noCache: true,
        },
      },
      {
        path: 'view',
        name: 'RepairView',
        component: () => import('@/views/eam/repair/view'),
        meta: {
          title: '查看',
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
          title: '编辑',
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
    path: '/eam/maintenance',
    name: 'Maintenance',
    component: NormalLayout,
    redirect: '/eam/maintenance/index',
    children: [
      {
        path: 'index',
        name: 'MaintenanceIndex',
        component: () => import('@/views/eam/maintenance/index'),
        meta: {
          title: '设备保养管理',
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
    component: NormalLayout,
    redirect: '/eam/spotInspection/index',
    children: [
      {
        path: 'index',
        name: 'SpotInspectionIndex',
        component: () => import('@/views/eam/spotInspection/index'),
        meta: {
          title: '保养方案管理',
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
        path: 'edit',
        name: 'SpotInspectionEdit',
        component: () => import('@/views/eam/spotInspection/edit'),
        meta: {
          title: '编辑',
          noCache: true,
        },
      },
    ],
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

const router = createRouter({
  //history : createWebHashHistory( './' ),
  history: createWebHistory('./'), //history mode
  routes: constantRoutes.concat(asyncRoutes),
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export function resetRouter() {
  const WHITE_NAME_LIST = ['Login']
  router.getRoutes().forEach(route => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export default router
