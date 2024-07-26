import { defineStore } from 'pinia'
import cookies from '@/utils/cookies'
import { localStorageHandle } from '@/utils/storage'
import { TOKEN, ACCESS_TOKEN, CURRENT_USER, IS_LOCKSCREEN, ResultEnum } from '@/config/constant'
import { getUserInfo, login, userLogout } from '@/api/system/user'
import { resetRouter } from '@/router'
import { resetStore } from '@/store'

//import useTagsViewStore from './tagsView'

const useUserStore = defineStore({
  id : 'app-user',
  state : () => {
    return {
      token : localStorageHandle.getItem(ACCESS_TOKEN, ''),
      username : '',
      welcome : '',
      avatar : '',
      permissions : [],
      info : localStorageHandle.getItem(CURRENT_USER, {}),
      siteId : '',
      roles : []
    }
  },
  actions : {
    setSiteId(id){
      this.siteId = id
    },
    setToken(token = ''){
      token ? cookies.set(TOKEN, token) : cookies.remove(TOKEN)
      this.token = token
    },
    setAvatar(avatar){
      this.avatar = avatar
    },
    setPermissions(permissions){
      this.permissions = permissions
    },
    setUserInfo(info){
      this.info = info
    },
    setRoles(roles){
      this.roles = roles
    },
    //登录
    async login(userInfo){
      try {
        const response = await login(userInfo)
        const { data, code } = response
        if (code === ResultEnum.SUCCESS){
          const ex = 7 * 24 * 60 * 60 * 1000
          localStorageHandle.setItem(ACCESS_TOKEN, data?.access_token, ex)
          localStorageHandle.setItem(CURRENT_USER, data, ex)
          localStorageHandle.setItem(IS_LOCKSCREEN, false)
          this.setToken(data?.access_token ?? '')
          this.setUserInfo(data)
        }
        return Promise.resolve(response)
      } catch (e){
        return Promise.reject(e)
      }
    },

    //获取用户信息
    GetInfo(){
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then(({ data }) => {
            const result = data
            if (result.permissions && result.permissions.length){
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
    async logout(){
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

    //SET_TOKEN( token = '' ) {
    //token ? cookies.set( TOKEN, token ) : cookies.remove( TOKEN )
    //this.token = token
    //},
    //SET_USER_INFOS( data ) {
    //const { name, avatar, roles } = data
    //this.name = name
    //this.avatar = avatar
    //this.roles = roles
    //},
    //SET_NAME( name ) {
    //this.name = name
    //},
    //SET_AVATAR( avatar ) {
    //this.avatar = avatar
    //},
    //SET_ROLES( roles ) {
    //this.roles = roles
    //},
    //CLEAR_USER_INFOS() {
    //this.token = ''
    //this.name = ''
    //this.avatar = ''
    //this.roles = []
    //},

    //async GET_USER_INFO() {
    //try {
    //const { code, data } = await getInfo()
    //if ( code == 200 ) {
    //const { id, name, avatar, roles, phone, email, identity } = data
    //this.uid = id || '9527'
    //this.name = name || ''
    //this.phone = phone || ''
    //this.email = email || ''
    //this.identity = identity || ''
    //this.avatar = avatar || AVATAR
    //this.roles = roles || ['editor']
    //return {
    //...data,
    //uid : this.uid,
    //roles : this.roles
    //}
    //}
    //} catch ( error ) {
    //return error
    //}
    //},
    //async LOGIN_OUT() {
    //try {
    //const { code } = await logout( this.token )
    //if ( code == 200 ) {
    //this.token = ''
    //this.name = ''
    //this.avatar = ''
    //this.phone = ''
    //this.email = ''
    //this.identity = ''
    //this.roles = []
    //this.RESET_INFO()
    //}
    //} catch ( error ) {
    //return error
    //}
    //},
    //清空所有登录信息
    RESET_INFO(){
      return new Promise(resolve => {
        //const tagsViewStore = useTagsViewStore()
        cookies.clearAll()
        resetRouter()
        //tagsViewStore.DEL_ALL_VIEWS( null )
        resolve()
      })
    }
  }
})
export default useUserStore
