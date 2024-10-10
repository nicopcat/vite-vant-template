import { defineStore } from 'pinia'
import cookies from '@/utils/cookies'
import { localStorageHandle } from '@/utils/storage'
import { TOKEN, ACCESS_TOKEN, CURRENT_USER, IS_LOCKSCREEN, ResultEnum } from '@/config/constant'
import { getUserInfo, login, userLogout } from '@/api/system/user'
import { resetRouter } from '@/router'
import { resetStore } from '@/store'
import { listMenu } from '@/api/system/menu'
import { listByIds } from '@/api/system/oss'
//import useTagsViewStore from './tagsView'

const useUserStore = defineStore({
  id: 'app-user',
  state: () => {
    return {
      token: localStorageHandle.getItem(ACCESS_TOKEN, ''),
      username: '',
      welcome: '',
      avatar: '',
      permissions: [],
      info: localStorageHandle.getItem(CURRENT_USER, {}),
      siteId: '',
      roles: [],
      menus: [],
    }
  },
  getters: {
    getToken() {
      return this.token
    },
    getAvatar() {
      return this.avatar
    },
    getNickname() {
      return this.info?.user?.nickName
    },
    getPermissions() {
      return this.permissions
    },
    getUserInfo() {
      return this.info
    },
    getRoles() {
      return this.roles
    },
    getMenus() {
      return this.menus
    },
  },
  actions: {
    setSiteId(id) {
      this.siteId = id
    },
    setToken(token = '') {
      token ? cookies.set(TOKEN, token) : cookies.remove(TOKEN)
      this.token = token
    },
    setAvatar(avatar) {
      this.avatar = avatar
    },
    setPermissions(permissions) {
      this.permissions = permissions
    },
    setUserInfo(info) {
      this.info = info
    },
    setRoles(roles) {
      this.roles = roles
    },
    setMenus(menus) {
      this.menus = menus
    },
    //登录
    async login(userInfo) {
      try {
        const response = await login(userInfo)
        const { data, code } = response
        if (code === ResultEnum.SUCCESS) {
          const ex = 7 * 24 * 60 * 60 * 1000
          localStorageHandle.setItem(ACCESS_TOKEN, data?.access_token, ex)
          localStorageHandle.setItem(CURRENT_USER, data, ex)
          localStorageHandle.setItem(IS_LOCKSCREEN, false)
          this.setToken(data?.access_token ?? '')
          this.setUserInfo(data)
          // this.GET_ASYNCMENU() // 加载menu
        }
        return Promise.resolve(response)
      } catch (e) {
        return Promise.reject(e)
      }
    },

    //获取用户信息
    GetInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(({ data }) => {
            const result = data
            if (result.permissions && result.permissions.length) {
              const permissionsList = result.permissions
              this.setPermissions(permissionsList)
            }
            this.setUserInfo(result)
            this.setAvatar(result.user.avatar)
            this.setSiteId(result?.user?.siteId)
            this.setRoles(result.roles)

            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    //登出
    async logout() {
      return new Promise((resolve, reject) => {
        this.setPermissions([])
        this.setUserInfo({})
        localStorageHandle.clear()
        //重置 Store
        resetStore()
        this.RESET_INFO()
        userLogout()
          .then(() => {
            return resolve(true)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    //清空所有登录信息
    RESET_INFO() {
      return new Promise(resolve => {
        //const tagsViewStore = useTagsViewStore()
        cookies.clearAll()
        resetRouter()
        //tagsViewStore.DEL_ALL_VIEWS( null )
        resolve()
      })
    },
    //获取菜单
    async GET_ASYNCMENU() {
      const { data } = await listMenu()
      const iconPromises = data.map(async menu => {
        await Promise.all(
          menu.routers.map(async router => {
            await Promise.all(
              router.children.map(async child => {
                if (child?.meta.icon) {
                  const { data } = await listByIds(child.meta.icon)
                  child.meta.iconPath = data[0]?.url
                }
              })
            )
          })
        )
        return menu
      })

      const menuList = await Promise.all(iconPromises)
      this.setMenus(menuList)
      return menuList
    },
  },
})
export default useUserStore
