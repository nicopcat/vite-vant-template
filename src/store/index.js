import { createPinia, getActivePinia, defineStore } from 'pinia'
import useUserStore from './modules/users'
import useTagsViewStore from './modules/tagsView'
import useAppStore from './modules/app'
import useSettingsStore from './modules/settings'
import usePermissionStore from './modules/permission'

const store = createPinia()

export function registerStore(app){
  app.use(store)
}

//storeIds 对应 src\store\modules 中模块 id
export function resetStore(){
  const storeIds = ['app-user']
  const activePinia = getActivePinia()
  if (activePinia){
    Object.entries(activePinia.state.value).forEach(([name, state]) => {
      if (storeIds.includes(name)){
        const definition = defineStore(name, state)
        const _store = definition(activePinia)
        _store.$reset()
      }
    })
  }
}

export { useUserStore, useTagsViewStore, useAppStore, useSettingsStore, usePermissionStore }

export default store
