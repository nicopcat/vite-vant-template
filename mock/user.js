// http://mockjs.com/examples.html#Object
const loginInfo = () => {
  const result = {
    token: 'token',
  }
  return result
}

const userInfo = () => {
  const result = {
    user: {
      userId: 1,
      siteId: '000000',
      deptId: 103,
      userName: 'admin',
      nickName: '超级管理员',
      userType: 'sys_user',
      email: 'crazyLionLi@163.com',
      phonenumber: '15888888888',
      sex: '1',
      avatar: 'https://test-env.manasmes.gxjxcloud.com/oss/2024/05/17/ea6c3f4036c642d39f8cbf677bf356a9.png',
      status: '0',
      loginIp: '127.0.0.1',
      loginDate: '2024-08-20 16:58:10',
      remark: '管理员',
      createTime: '2024-05-08 02:42:53',
      dept: {
        deptId: 103,
        parentId: 101,
        parentName: null,
        ancestors: '0,100,101',
        deptName: '研发部门',
        orderNum: 1,
        leader: 1,
        leaderName: null,
        phone: null,
        email: 'xxx@qq.com',
        status: '0',
        createTime: null,
      },
      roles: [
        {
          roleId: 1,
          roleName: '超级管理员',
          roleKey: 'superadmin',
          roleSort: 1,
          dataScope: '1',
          menuCheckStrictly: null,
          deptCheckStrictly: null,
          status: '0',
          remark: '管理员',
          createTime: null,
          flag: false,
          superAdmin: true,
        },
        {
          roleId: 20,
          roleName: 'qwewqeqettttttt',
          roleKey: '123tt',
          roleSort: 122,
          dataScope: '2',
          menuCheckStrictly: null,
          deptCheckStrictly: null,
          status: '0',
          remark: '管理员',
          createTime: null,
          flag: false,
          superAdmin: false,
        },
      ],
      roleIds: null,
      postIds: null,
      roleId: 1,
    },
    permissions: ['*:*:*'],
    roles: ['superadmin'],
    checkInitPasswd: false,
  }
  return result
}

const list = () => {
  const result = []
  // const total = 10000 * 10
  const total = 10000 * 10
  for (let i = 1; i <= total; i++) {
    const item = {
      id: '@increment',
      method: i % 4,
      deviceType: '@pick(["web", "glass", "mobile", "desktop", "others"])', // 设备名称
      deviceOs: '@pick(["win10", "win11", "ios", "android", "others"])', // 系统
      loginAddr: '@city(true)', // 登录地点
      loginTime: ' @datetime()', // 最后登录时间
    }
    result.push(item)
  }

  return result
}

export default [
  {
    url: '/api/auth/login',
    type: 'post',
    response: config => {
      // const { username } = config.body
      // const token = tokens[username]
      // if (!token) {
      //   return {
      //     code: 60204,
      //     message: '账号密码错误'
      //   }
      // }
      return {
        code: 200,
        message: 'success',
        data: {
          token: 'token',
        },
        // data: loginInfo()
      }
    },
  },

  {
    url: '/api/system/user/getInfo',
    type: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
        data: userInfo(),
      }
    },
  },

  {
    url: '/api/test',
    type: 'get',
    response: () => {
      return {
        code: 5004,
        message: 'fail',
        data: [],
      }
    },
  },

  {
    url: '/api/logout',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: 'success',
      }
    },
  },

  {
    url: '/api/login/history',
    type: 'get',
    response: config => {
      return {
        code: 200,
        message: 'success',
        data: list(),
      }
    },
  },
]
